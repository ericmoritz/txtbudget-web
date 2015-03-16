from txtbudget_web import service
import unittest
from pyld import jsonld
import json
from werkzeug.test import Client
from werkzeug.wrappers import BaseResponse
from urlparse import urlparse

def parse_json(src):
    return json.loads(src)

def striphost(url):
    bits = urlparse(url)
    if bits.query:
        return bits.path + "?" + bits.query
    else:
        return bits.path


class TestService(unittest.TestCase):
    def setUp(self):
        self.app = service.App().test_client()
        
    def testGenerateTransactions(self):
        # get the index
        index = self.app.get("/service")
        
        # construct a transactions request using the index's transaction's dict
        index_json = parse_json(index.data)
        transactions_url = index_json['transactions']['@id']
        transactions_form = {
            "@context": index_json['@context'],
            "csv": """ 
test, 10.00, 2015-03-14, 1m""",
            "startDate": "2015-03-14",
        }

        # make the transactions request
        transactions = self.app.post(
            transactions_url, 
            data=json.dumps(transactions_form),
            follow_redirects=True
        )
        transactions_json = parse_json(transactions.data)

        # validate the returned transactions
        self.assertEqual(
            transactions_json['member'],
            [
                {u'@id': u'#2015-03-14T00:00:00,test',
                 u'@type': u'Transaction',
                 u'amount': 10.0,
                 u'balance': 10.0,
                 u'date': u'2015-03-14T00:00:00',
                 u'label': u'test'},
                {u'@id': u'#2015-04-14T00:00:00,test',
                 u'@type': u'Transaction',
                 u'amount': 10.0,
                 u'balance': 20.0,
                 u'date': u'2015-04-14T00:00:00',
                 u'label': u'test'}
            ]
        )

        # request the next page
        print transactions_json['nextPage']
        # striphost is needed because the test client doesn't like absolute URLs
        transactions_json = parse_json(self.app.get(
            striphost(transactions_json['nextPage'])).data
        )

        # validate the result
        self.assertEqual(
            transactions_json['member'],
            [
                {u'@id': u'#2015-05-14T00:00:00,test',
                 u'@type': u'Transaction',
                 u'amount': 10.0,
                 u'balance': 30.0,
                 u'date': u'2015-05-14T00:00:00',
                 u'label': u'test'}
            ]
        )
