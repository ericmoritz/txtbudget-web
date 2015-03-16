var React = require("react");
var HydraClient = require("../../lib/hydra/utils/HydraClient");
var jsonld = require("jsonld");
var TxtBudgetConstants = require("../constants/TxtBudgetConstants");
var Transactions = require("./Transactions");


module.exports = React.createClass({
    render() {
	return <Transactions resource={this.props.resource} />;
    }
})
