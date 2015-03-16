var React = require("react");
var HydraClient = require("../../lib/hydra/utils/HydraClient");
var jsonld = require("jsonld");
var TxtBudgetConstants = require("../constants/TxtBudgetConstants");
var TransactionsForm = require("./TransactionsForm");
var TransactionsMembers = require("./TransactionsMembers");
var TransactionsStore = require("../stores/TransactionsStore");
var TransactionsFormStore = require("../stores/TransactionsFormStore");
var bs = require('react-bootstrap');

module.exports = React.createClass({
    render() {
	return (
		<bs.Grid>
		  <bs.Col md={8}>
		    <TransactionsForm 
		      url={this.props.resource.transactions['@id']}
	              store={TransactionsFormStore} />
		  </bs.Col>
		  <bs.Col md={4}>
                    <TransactionsMembers store={TransactionsStore}/>
		  </bs.Col>
		</bs.Grid>
	);
    }
})
