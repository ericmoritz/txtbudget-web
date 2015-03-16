var React = require("react");
var HydraClient = require("../../lib/hydra/utils/HydraClient");
var jsonld = require("jsonld");
var TxtBudgetConstants = require("../constants/TxtBudgetConstants");
var TransactionsFormStore = require("../stores/TransactionsFormStore");
var Transactions = require("./Transactions");
var dateformat = require("dateformat");
var bs = require('react-bootstrap');
var $ = require('jquery');

module.exports = React.createClass({
    onSuccess() {
    },
    onClick() {
	var data = TransactionsFormStore.get();
	// convert the csv data to a data: url
	var dataURI = `data:,${escape(data.csv)}`

	Dropbox.save(
	    dataURI, "budget.txt",
	    {
		success: this.onSuccess
	    }
	)
    },
    render() {
	return <bs.Button onClick={this.onClick}>Save to Dropbox</bs.Button>
    }
})
