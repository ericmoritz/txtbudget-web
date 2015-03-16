var HydraConstants = require('../constants/HydraConstants');
var Dispatcher = require('flux').Dispatcher;
var assign = require('object-assign');

var PayloadSources = HydraConstants.PayloadSources;

var HydraDispatcher = assign(new Dispatcher(), {
    handleServerAction(action) {
	this.dispatch({
	    source: PayloadSources.SERVER_ACTION,
	    action: action
	});
    },
    handleViewAction(action) {
	this.dispatch({
	    source: PayloadSources.VIEW_ACTION,
	    action: action
	});
    }
});

module.exports = HydraDispatcher;
