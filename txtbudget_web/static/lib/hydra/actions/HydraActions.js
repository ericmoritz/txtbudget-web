var HydraDispatcher = require("../dispatcher/HydraDispatcher");
var HydraConstants = require("../constants/HydraConstants");

module.exports = {
    navigateComplete(data, status, xhr, options) {
	HydraDispatcher.handleServerAction({
	    type: HydraConstants.NAVIGATE_COMPLETE,
	    data: data,
	    status: status,
	    xhr: xhr,
	    options: options,
	})
    },
    navigateError(xhr, status, error, options) {
	HydraDispatcher.handleServerAction({
	    type: HydraConstants.NAVIGATE_ERROR,
	    xhr: xhr,
	    status: status,
	    error: error,
	    options: options
	})
    }
}
