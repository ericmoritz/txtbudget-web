var React = require("react");
var HydraClient = require("../../lib/hydra/utils/HydraClient");
var jsonld = require("jsonld");
var TxtBudgetConstants = require("../constants/TxtBudgetConstants");
var bs = require('react-bootstrap');
var DropboxChooser = require("./DropboxChooser");
var $ = require("jquery");

module.exports = React.createClass({
    handleSubmit() {
	var csv = this.state.csv;
	HydraClient.POST(
	    this.props.url,
	    {
		"@context": TxtBudgetConstants.CONTEXT,
		"csv": csv
	    }
	)
    },
    onChange() {
	this.setState({csv: this.refs.csv.getValue()})
    },
    onDropboxChooser(files) {
	if(files.length) {
	    this.setState({csv: files[0].data});
	}
    },
    getInitialState() {
	return {csv: this.props.resource['csv']}
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
		  value={this.state.csv} 
		  onChange={this.onChange}
		 />

        </div> )
    }
})
