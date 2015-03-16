var React = require("react");
var HydraClient = require("../../lib/hydra/utils/HydraClient");
var jsonld = require("jsonld");
var TxtBudgetConstants = require("../constants/TxtBudgetConstants");
var TransactionsForm = require("./TransactionsForm");
var TransactionsMembers = require("./TransactionsMembers");
var TransactionsStore = require("../stores/TransactionsStore");
var bs = require('react-bootstrap');

module.exports = React.createClass({
    render() {
	return (
		<bs.Grid>
		  <bs.Col md={6}>
		    <TransactionsForm 
		      url={this.props.resource.transactions['@id']}
	              resource={this.props.resource.transactionsForm} />
		  </bs.Col>
		  <bs.Col md={6}>
                    <TransactionsMembers store={TransactionsStore}/>
		  </bs.Col>
		</bs.Grid>
	);
    }
})
