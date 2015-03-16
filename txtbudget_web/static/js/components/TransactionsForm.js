var React = require("react");
var HydraClient = require("../../lib/hydra/utils/HydraClient");
var jsonld = require("jsonld");
var TxtBudgetConstants = require("../constants/TxtBudgetConstants");
var bs = require('react-bootstrap');
var DropboxChooser = require("./DropboxChooser");
var $ = require("jquery");
var TxtBudgetActions = require("../actions/TxtBudgetActions");

module.exports = React.createClass({
    handleSubmit() {
	var data = this.props.store.get()
	HydraClient.POST(
	    this.props.url,
	    data
	)
    },
    onChange() {
	// Update the TransactionsFormStore via the transactionsFormLoad action
	var data = this.props.store.get();
	data.csv = this.refs.csv.getValue();
	TxtBudgetActions.transactionsFormPut(data);
    },
    onDropboxChooser(files) {
	if(files.length) {
	    // Update the TransactionsFormStore via the transactionsFormLoad action
	    var data = this.props.store.get();
	    data.csv = files[0].data;
	    TxtBudgetActions.transactionsFormPut(data);
	}
    },
    componentDidMount() {
	this.props.store.addChangeListener(this._onStoreChange);
    },
    componentDidUnMount() {
	this.props.store.removeChangeListener(this._onStoreChange);
    },
    _onStoreChange() {
	this.setState({resource: this.props.store.get()})
    },
    getInitialState() {
	return {resource: this.props.store.get()}
    },
    render() {
	var inputStyle = {
	    height: "90%",
	}

	return ( <div>
  		   <bs.Button bsStyle="primary" onClick={this.handleSubmit}>Update</bs.Button>
		   <DropboxChooser onSuccess={this.onDropboxChooser} />
		 <bs.Input type="textarea" 
	          ref="csv" 
		  style={inputStyle}
		  value={this.state.resource.csv} 
		  onChange={this.onChange}
		 />

        </div> )
    }
})
