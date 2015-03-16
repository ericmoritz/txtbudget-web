var React = require("react");
var HydraClient = require("../../lib/hydra/utils/HydraClient");
var jsonld = require("jsonld");
var TxtBudgetConstants = require("../constants/TxtBudgetConstants");
var bs = require('react-bootstrap');

module.exports = React.createClass({
    handleSumbit(e) {
	e.preventDefault();
	var csv = this.refs.csv.getValue().trim();
	HydraClient.POST(
	    this.props.url,
	    {
		"@context": TxtBudgetConstants.CONTEXT,
		"csv": csv
	    }
	)
    },
    render() {
	var csv = this.props.resource['csv'];
	var inputStyle = {
	    height: "90%",
	}

	return ( <div>
  	      <bs.Button bsStyle="primary" onClick={this.handleSumbit}>Update</bs.Button>
	      <bs.Input type="textarea" 
	        ref="csv" 
		style={inputStyle}
                defaultValue={csv} />
        </div> )
    }
})
