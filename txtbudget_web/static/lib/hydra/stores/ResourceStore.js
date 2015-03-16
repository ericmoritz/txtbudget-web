var HydraDispatcher = require("../dispatcher/HydraDispatcher");
var EventEmitter = require('events').EventEmitter;
var HydraConstants = require("../constants/HydraConstants");
var assign = require('object-assign');

var CHANGE_EVENT = Symbol("HYDRA_PAGESTORE_CHANGE_EVENT");

// Currently loaded data
var _data = {};

var ResourceStore = module.exports = assign({}, EventEmitter.prototype, {
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

ResourceStore.dispatchToken = HydraDispatcher.register(function(payload) {
    var action = payload.action
    switch(action.type) {
	case HydraConstants.NAVIGATE_COMPLETE:
	  _data = action.data;
	  ResourceStore.emitChange();
	  break;
    }
});
