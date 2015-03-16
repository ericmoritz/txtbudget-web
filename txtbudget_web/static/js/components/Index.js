var React = require("react");
var HydraClient = require("../../lib/hydra/utils/HydraClient");
var jsonld = require("jsonld");
var TxtBudgetConstants = require("../constants/TxtBudgetConstants");
var Transactions = require("./Transactions");
var dateformat = require("dateformat");

module.exports = React.createClass({
    render() {
	if(!this.props.resource.transactionsForm) {
	    var now = dateformat(new Date(), "isoDate");

	    // Set the default transactionsForm
	    this.props.resource.transactionsForm = {
		csv: `
0-balance, 10.00, ${now}, 1m
1-expense, -3.00, ${now}, 1w
`
	    }
	}
	return <Transactions resource={this.props.resource} />;
    }
})
