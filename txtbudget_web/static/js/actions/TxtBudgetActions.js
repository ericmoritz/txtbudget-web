var HydraDispatcher = require("../../lib/hydra/dispatcher/HydraDispatcher");
var TxtBudgetConstants = require("../constants/TxtBudgetConstants");

module.exports = {
    transactionsFormPut(data) {
	HydraDispatcher.handleServerAction({
	    type: TxtBudgetConstants.TRANSACTIONSFORM_PUT,
	    data: data
	})
    }
}
