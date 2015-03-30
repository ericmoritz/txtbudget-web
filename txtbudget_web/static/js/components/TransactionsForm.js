var React = require("react");
var HydraClient = require("../../lib/hydra/utils/HydraClient");
var jsonld = require("jsonld");
var TxtBudgetConstants = require("../constants/TxtBudgetConstants");
var bs = require('react-bootstrap');
var DropboxChooser = require("./DropboxChooser");
var DropboxSaver = require("./DropboxSaver");
var $ = require("jquery");
var TxtBudgetActions = require("../actions/TxtBudgetActions");
var TransactionsStore = require("../stores/TransactionsStore");
var TransactionsFormStore = require("../stores/TransactionsFormStore");


module.exports = React.createClass({
    handleSubmit() {
	var data = TransactionsFormStore.get()
	data.startDate = (new Date()).toISOString();
	this.state.loading = true;
	this.setState(this.state);
	TransactionsStore.reset(); // Not sure if this is very Flux like... 
	HydraClient.POST(this.props.url, data)
    },
    onDropboxChooser(files) {
	if(files.length) {
	    // Update the TransactionsFormStore via the transactionsFormLoad action
	    var data = TransactionsFormStore.get();
	    data.csv = files[0].data;
	    TxtBudgetActions.transactionsFormPut(data);
	}
    },
    onInputChange() {
	// Update the TransactionsFormStore via the transactionsFormLoad action
	var data = TransactionsFormStore.get();
	data.csv = this.refs.csv.getValue();
	TxtBudgetActions.transactionsFormPut(data);
    },
    componentDidMount() {
	TransactionsFormStore.addChangeListener(this._onStoreChange);
	TransactionsStore.addChangeListener(this._onTransactionsChange);
    },
    componentDidUnMount() {
	TransactionsFormStore.removeChangeListener(this._onStoreChange);
	TransactionsStore.removeChangeListener(this._onTransactionsChange);
    },
    _onStoreChange() {
	this.setState({resource: TransactionsFormStore.get()})
    },
    _onTransactionsChange() {
	this.state.loading = false;
	this.setState(this.state);
    },
    getInitialState() {
	return {loading: false, resource: TransactionsFormStore.get()}
    },
    render() {
	var inputStyle = {
	    height: "90%",
	}

	return ( <div>

  		   <bs.Button bsStyle="primary" onClick={this.handleSubmit}>{this.state.loading ? "Loading" : "Update" }</bs.Button>
		   <DropboxChooser onSuccess={this.onDropboxChooser} />
		   <DropboxSaver />

		 <bs.Input type="textarea" 
	          ref="csv" 
		  style={inputStyle}
		  value={this.state.resource.csv} 
		  onChange={this.onInputChange}
		 />

        </div> )
    }
})
