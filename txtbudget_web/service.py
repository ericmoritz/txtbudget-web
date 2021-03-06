from flask import jsonify, Flask, url_for, request, redirect, render_template
from flask.ext.cacheify import init_cacheify
from txtbudget import queries
from dateutil import parser
from dateutil.tz import gettz
from functools import wraps
from pyld import jsonld
from datetime import timedelta, date, datetime
from werkzeug import Request
from werkzeug.contrib.cache import SimpleCache
import json
from StringIO import StringIO
from uuid import uuid1 as uuid
import re
import os

def _scheme():
    return request.environ.get(
        "HTTP_X_FORWARDED_PROTO",
        request.environ.get(
            'wsgi.url_scheme', 
            'http'
        ),
    )


def absolute_url(*args, **kwargs):
    kwargs['_external'] = True
    kwargs['_scheme'] = _scheme()
    return url_for(*args, **kwargs)


def trace(x):
    from pprint import pprint
    pprint(x)
    return x


def _cast_datetime(dt):
    if isinstance(dt, date):
        return datetime(dt.year, dt.month, dt.day, 0, 0, 0)
    else:
        return dt
    

def _force_tzinfo(tzinfo, dt):
    if dt.tzinfo is None:
        return dt.replace(tzinfo=tzinfo)
    else:
        return dt.astimezone(tzinfo)
    

def _isoformat(tzinfo, dt):
    return _force_tzinfo(
        tzinfo,
        _cast_datetime(dt)
    ).isoformat()


def _parseDate(iso8601_val, tzinfo=None):
    return _force_tzinfo(
        tzinfo,
        parser.parse(iso8601_val)
    ).replace(tzinfo=None)


def App():
    app = Flask(__name__)
    app.config['DEBUG'] = os.environ.get("DEBUG") == "true"

    TRANSACTIONS_TIMEOUT = 30 * 60
    cache = init_cacheify(app)

    def _context():
        return {
            "tb": "http://rdf.vocab-ld.org/vocabs/txtbudget.jsonld#",
            "csv": "tb:csv",
            "Index": "tb:Index",
            "TransactionsForm": "tb:TransactionsForm",
            "transactionsForm": "tb:transactionsForm",
            "Transactions": "tb:Transactions",
            "Transaction": "tb:Transaction",
            "transactions": "tb:transactions",
            "balance": "tb:balance",

            ## 
            "xps": "http://vocab.deri.ie/xps#",
            "amount": "xps:amount",

            ## 
            "dc": "http://purl.org/dc/elements/1.1/",
            "date": "dc:date",

            ## 
            "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
            "comment": "rdfs:comment", 
            "label": "rdfs:label",

            ## 
            "hydra": "http://www.w3.org/ns/hydra/core#",
            "PagedCollection": "hydra:PagedCollection",
            "member": "hydra:member",
            "nextPage": "hydra:nextPage",
            "previousPage": "hydra:previousPage",
            "supportedClass": "hydra:supportedClass",
            "supportedProperty": "hydra:supportedProperty",
            "Link": "hydra:Link",

            ## 
            "schema": "http://schema.org/",
            "startDate": "schema:startDate",
            "endDate": "schema:endDate",

            "owl": "http://www.w3.org/2002/07/owl#",
        }


    def service_response(fun):
        @wraps(fun)
        def inner(*args, **kwargs):
            is_debug = request.args.get('debug', 'false') == 'true'

            data = fun(*args, **kwargs)

            if type(data) == tuple:
                return data

            transactions_url = absolute_url("transactions")
            data.update({
                "@context": _context(),
                "environ": {
                    key:value 
                    for key, value in
                    (request.environ if is_debug else {}).items()
                    if type(value) in {str, unicode, list, dict}
                },
                "@graph": [
                    {
                        "@id": "http://rdf.vocab-ld.org/vocabs/txtbudget.jsonld",
                        "owl:sameAs": absolute_url("vocab")
                    }
                ],
                "transactions": {
                    "@id": transactions_url,
                    "operation": {
                        "method": "POST",
                        "expects": "TransactionsForm",
                        "returns": "Transactions"
                    },
                }
            })
            return jsonify(**data)
        return inner

    @app.route("/")
    def index_html():
        return render_template("index.html")

    @app.route("/service")
    @service_response
    def index():
        return {
            "@type": "Index",
        }

    @app.route("/service/vocab")
    @service_response
    def vocab():
        return {
            "supportedClass": [
                {
                    "@id": "Index",
                    "supportedProperty": [
                        {
                            "@id": "transactions",
                            "@type": "Link",
                            "comment": "link to the transactions"
                        }
                    ]
                },
                {
                    "@id": "TransactionsForm",
                    "supportedProperty": [
                        {
                            "@id": "csv",
                            "comment": "txtbudget csv contents"
                        },
                        {
                            "@id": "startDate",
                            "comment": "start date for the transactions"
                        },
                        {
                            "@id": "timezone",
                            "comment": "IANA time zone database timezone id. Defaults to \"America/New_York\"",
                        }
                    ]
                },
                {
                    "@id": "Transactions",
                    "rdfs:subClassOf": "PagedCollection"
                },
                {
                    "@id": "Transaction",
                    "supportedProperty": [
                        {"@id": "balance", "comment": "current balance since the startDate"},
                        {"@id": "date"},
                        {"@id": "amount"},
                        {"@id": "label"}
                    ]
                }
            ]
        }
        

    @app.route("/service/transactions", methods=["POST"])
    def transactions():
        data = jsonld.compact(
            request.get_json(force=True),
            _context()
        )
        key = unicode(uuid())
        cache.set(key, data, timeout=TRANSACTIONS_TIMEOUT)
        
        return redirect(
            absolute_url(
                "transactions_GET",
                key=key,
            ),
            code=303
        )

    @app.route("/service/transactions/<key>")
    @service_response
    def transactions_GET(key):
        trace(request)
        data = cache.get(key)
        tzinfo = gettz(
            data.get('timezone', "America/New_York")
        )

        if data is None:
            # return 404
            return "", 404

        # refresh the cache to keep it in memory
        cache.set(key, data, timeout=TRANSACTIONS_TIMEOUT)
        balance = float(request.args.get('balance', '0.0'))

        start_date = _parseDate(
            request.args.get(
                'startDate', 
                data.get(
                    'startDate',
                    _isoformat(tzinfo, date.today())
                )
            ),
            tzinfo=tzinfo
        )
        start_date = start_date.replace(
            hour=0, minute=0, second=0, microsecond=0)
        end_date = start_date + timedelta(days=32)

        transactionsForm = {'csv': data['csv']}
        members = _members(
            tzinfo,
            data['csv'], 
            balance,
            end_date,
            start_date
        )

        # build the members array
        nextPage = absolute_url(
            "transactions_GET", 
            key=key,
            startDate=_isoformat(tzinfo, end_date + timedelta(days=1)),
            balance=members[-1]['balance'] if len(members) else 0.0,
        )

        return {
            "@type": "Transactions",
            "@id": absolute_url("transactions_GET", key=key),
            "transactionsForm": transactionsForm,
            "member": members,
            "nextPage": nextPage
        }
    return app
    

data_uri_re = re.compile(r"data:(.+);base64,(.+)")
def _data_uri_decode(data_uri):
    match = data_uri_re.match(data_uri)
    if match:
        return match.group(1), match.group(2).decode("base64")
    else:
        return None, None


def _data_uri_encode(content_type, data):
    return "data:{content_type};base64,{base64}".format(
        content_type=content_type,
        base64=data.encode("base64")
    )


def TransactionItem_to_ld(tzinfo, ti):
    date = _isoformat(tzinfo, ti.date)
    return {
        "@type": "Transaction",
        "@id": "#{date},{name}".format(date=date, name=ti.name),
        "label": ti.name,
        "amount": ti.amount,
        "date": date
    }


def _members(tzinfo, csv, balance, end_date, start_date):
    members = []
    for item in queries.until(
            csv.splitlines(),
            end_date,
            start_date):
        member = TransactionItem_to_ld(tzinfo, item)
        balance += member['amount']
        member['balance'] = balance
        members.append(member)
    return members

