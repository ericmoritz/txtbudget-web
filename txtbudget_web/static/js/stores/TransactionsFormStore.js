var HydraDispatcher = require("../../lib/hydra/dispatcher/HydraDispatcher");
var EventEmitter = require('events').EventEmitter;
var TxtBudgetConstants = require("../constants/TxtBudgetConstants");
var assign = require('object-assign');
var dateformat = require("dateformat");

var CHANGE_EVENT = Symbol("TXTBUDGET_CSV_CHANGE_EVENT");

// Currently loaded data

var now = dateformat(new Date(), "isoDate");
var _data = {
    "@context": TxtBudgetConstants.CONTEXT,
    csv: `
0-balance, 10.00, ${now}, 1m
1-expense, -3.00, ${now}, 1w
`
}

var TransactionsFormStore = module.exports = assign({}, EventEmitter.prototype, {
    emitChange() {
	this.emit(CHANGE_EVENT);
    },
    addChangeListener(callback) {
	this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener(callback) {
	this.removeListener(CHANGE_EVENT, callback);
    },
    get() {
	return _data;
    }
});

TransactionsFormStore.dispatchToken = HydraDispatcher.register(function(payload) {
    var action = payload.action
    switch(action.type) {
	case TxtBudgetConstants.TRANSACTIONSFORM_PUT:
	  _data = action.data;
	TransactionsFormStore.emitChange()
    }
});

