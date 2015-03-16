var $ = require("jquery");
var HydraActions = require("../actions/HydraActions");
var assign = require("object-assign");

function hashUrl(hash) {
    if(hash) {
	return hash.substring(1, hash.length);
    }
}

module.exports = {
    GET(url) {
	this.ajax({url:url});
    },
    POST(url, obj) {
	this.ajax({
	    url:url,
	    dataType: "json",
	    contentType: "application/json",
	    converters: {
		"* text": window.String, 
		"text json": $.parseJSON
	    },
	    data: JSON.stringify(obj),
	    type: "POST"
	});
    },
    PUT(url, obj) {
	this.ajax({
	    url:url,
	    dataType: "json",
	    contentType: "application/json",
	    converters: {
		"* text": window.String, 
		"text json": $.parseJSON
	    },
	    data: JSON.stringify(obj),
	    type: "PUT"
	});
    },
    DELETE(url) {
	this.ajax({
	    url:url,
	    type: "DELETE"
	});
    },
    ajax(options) {
	$.ajax(
	    assign(
		options, 
		{
		    success: (data, status, xhr) => {
			HydraActions.navigateComplete(data, status, xhr, options);
		    },
		    error: (xhr, status, err) => {
			HydraActions.navigateError(xhr, status, err, options);
		    }
		}
	    )
	);
    },
    serverUrl() { 
	return hashUrl(window.location.hash);
    },
    loadHashUrl(service_url) {
	var url = this.serverUrl();
	// if the url is not in the hash, use the default service_url
	if(!!url) { 
	    this.ajax({url: url});
	} else {
	    this.GET(service_url)
	}
    },
    init(service_url) {
	// If the hash has a service url in it, load it
	this.loadHashUrl(service_url);
    }
}
