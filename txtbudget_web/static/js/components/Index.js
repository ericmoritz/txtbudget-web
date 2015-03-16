var React = require("react");
var HydraClient = require("../../lib/hydra/utils/HydraClient");
var jsonld = require("jsonld");
var TxtBudgetConstants = require("../constants/TxtBudgetConstants");
var Transactions = require("./Transactions");

module.exports = React.createClass({
    render() {
	if(!this.props.resource.transactionsForm) {
	    // Set the default transactionsForm
	    this.props.resource.transactionsForm = {
		csv: "test, 10.00, 2015-03-14, 1m"
	    }
	}
	return <Transactions resource={this.props.resource} />;
    }
})
