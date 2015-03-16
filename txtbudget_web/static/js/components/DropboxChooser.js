var React = require("react");
var HydraClient = require("../../lib/hydra/utils/HydraClient");
var jsonld = require("jsonld");
var TxtBudgetConstants = require("../constants/TxtBudgetConstants");
var Transactions = require("./Transactions");
var dateformat = require("dateformat");
var bs = require('react-bootstrap');
var $ = require('jquery');

module.exports = React.createClass({
    onSuccess(files) {
	// for each file, resolve their data
	var promises = files.map(
	    file => $.ajax(
		{url: file.link}
	    ).then(
		(data, status, xhr) => {
		    file['data'] = data;
		    return file
		}
	    )
	)
	// join the promises and fire off the onSuccess callback
	Promise.all(promises).then(
	    files => this.props.onSuccess(files)
	)
    },
    onClick() {
	Dropbox.choose({
	    success: this.onSuccess,
	    linkType: "direct",
	    extensions: [".txt", ".csv"]
	})
    },
    render() {
	return <bs.Button onClick={this.onClick}>Choose from Dropbox</bs.Button>
    }
})
