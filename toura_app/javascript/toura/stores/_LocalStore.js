dojo.provide('toura.stores._LocalStore');

dojo.require('dojo.store.Memory');

dojo.declare('toura.stores._LocalStore', dojo.store.Memory, {
  key : 'anonymous',

  add : function(item) {
    if (!item.id) {
      item.id = this._createId();
    }

    this.put(item);
  },

  put : function(item) {
    this.inherited(arguments);
    this._save();
  },

  remove : function(id) {
    this.inherited(arguments);
    this._save();
  },

  query : function(query, opts) {
    if (!query) {
      return dojo.store.util.QueryResults(this.data);
    }

    return this.inherited(arguments);
  },

  setData : function(data) {
    this.inherited(arguments);
    this._save();
  },

  _save : function() {
    toura.app.DeviceStorage.set(this.key, this.data);
  },

  _createId : function() {
    return (((1+Math.random())*0x10000)).toString(16).substring(1);
  },
});
