var HydraDispatcher = require("../../lib/hydra/dispatcher/HydraDispatcher");
var EventEmitter = require('events').EventEmitter;
var HydraConstants = require("../../lib/hydra/constants/HydraConstants");
var JSONLDUtils = require("../../lib/hydra/utils/JSONLDUtils");
var assign = require('object-assign');

var CHANGE_EVENT = Symbol("TXTBUDGET_TRANSACTIONS_CHANGE_EVENT");

// Currently loaded data
var _data = {};

var TransactionsStore = module.exports = assign({}, EventEmitter.prototype, {
    emitChange() {
	this.emit(CHANGE_EVENT);
    },
    addChangeListener(callback) {
	this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener(callback) {
	this.removeListener(CHANGE_EVENT, callback);
    },
    reset() {
	_data = {};
	this.emitChange();
    },
    get() {
	return _data;
    }
});

TransactionsStore.dispatchToken = HydraDispatcher.register(function(payload) {
    var action = payload.action
    switch(action.type) {
	case HydraConstants.NAVIGATE_COMPLETE:
	  if(JSONLDUtils.hasType("Transactions", action.data) && !!action.data.member) {
	      // if the id's are the same, extend the member array
	      if(!!_data['@id'] && _data['@id'] == action.data['@id']) {
		  var old_member = _data.member;
		  _data = action.data;
		  _data.member = _mergeMembers(old_member, _data.member)
	      // otherwise, set data to the current data
	      } else {
		  _data = action.data
	      }
	      TransactionsStore.emitChange();
	  }
	  break;
    }
});

function _mergeMembers(x, y) {
    var members = new Map();
    var ret = [];
    // dedupe the items, y overriding x
    for(var member of x) {
	members.set(member['@id'], member);
    }
    for(var member of y) {
	members.set(member['@id'], member);
    }
    // convert to array and sort
    return Array.from(members.values()).sort(
	(x, y) => {
		return +(x['@id'] > y['@id']) || +(x['@id'] == y['@id']) - 1;
	}
    )
}
