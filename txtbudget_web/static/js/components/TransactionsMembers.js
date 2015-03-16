var React = require("react");
var HydraClient = require("../../lib/hydra/utils/HydraClient");
var jsonld = require("jsonld");
var TxtBudgetConstants = require("../constants/TxtBudgetConstants");
var bs = require('react-bootstrap');
var Table = bs.Table;
var Price = require('format-price');


function dateFormat(dt) {
    return dt.toLocaleString(
	"en", 
	{"year":"numeric","month":"2-digit","day":"2-digit"}
    )
			     
}

function dollarFormat(dollars) {
    return Price.format('en-US', 'USD', dollars); 
}

module.exports = React.createClass({
    componentDidMount() {
	this.props.store.addChangeListener(this._onChange);
    },
    componentDidUnMount() {
	this.props.store.removeChangeListener(this._onChange);
    },
    _onChange() {
	this.setState({resource: this.props.store.get()})
    },
    getInitialState() {
	return {resource: this.props.store.get()}
    },
    loadNextPage(e) {
	e.preventDefault();
	HydraClient.GET(this.state.resource.nextPage);
    },
    render() {
	var members = !!this.state.resource.member ? this.state.resource.member : [];
	var nextPage = this.state.resource.nextPage;

	function memberMap(member) {
	    var bsStyle = member.balance < 0 ? "danger" : "success";
	    return (
		    <tr key={member['@id']} className={bsStyle}>
		    <td>{dollarFormat(member.balance)}</td>
                    <td>{dateFormat(new Date(member.date))}</td>
                    <td>{member.label}</td>
		    <td>{dollarFormat(member.amount)}</td>
		    </tr>
	    )
	}
	if(nextPage) {
	    var nextPageButton = <div onClick={this.loadNextPage}>next</div>
	} else {
	    var nextPageButton = null;
	}

	return (
	    <div>
		<Table striped bordered condensed hover>
		<thead>
		<th>Balance</th>
		<th>Date</th>
		<th>Name</th>
		<th>Amount</th>
		</thead>
		<tbody>
		{members.map(memberMap)}
	        </tbody>
	        </Table>
		{nextPageButton}
	    </div>
	)
    }
})
