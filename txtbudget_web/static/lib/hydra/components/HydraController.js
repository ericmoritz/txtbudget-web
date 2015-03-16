var React = require("react");
var ResourceStore = require("../stores/ResourceStore");
var jsonld = require("jsonld");
var JSONLDUtils = require("../utils/JSONLDUtils");


module.exports = React.createClass({
    componentDidMount() {
	ResourceStore.addChangeListener(this._onChange);
    },
    componentDidUnMount() {
	ResourceStore.removeChangeListener(this._onChange);
    },
    _onChange() {
	var data = ResourceStore.get();
	jsonld.expand(
	    data, 
	    (err, expanded) => {
		var types = JSONLDUtils.types(expanded);
		var type = types.length ? types[0] : null;

		if(!err && type && this.props.components && this.props.components[type]) {
		    var Component = this.props.components[type];
		    this.setState({
			ResourceComponent: Component,
			data: data
		    });
		}
	    });
    },
    render() {
	if(this.state && this.state.ResourceComponent) {
	    var Component = this.state.ResourceComponent;
	    var data = this.state.data;
	    return <Component resource={data} />;
	} else {
	    return <span />
	}
    }
});
