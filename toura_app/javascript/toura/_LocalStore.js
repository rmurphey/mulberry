dojo.provide('toura._LocalStore');

dojo.require('dojo.store.Memory');

dojo.declare('toura._LocalStore', dojo.store.Memory, {
  key : 'anonymous',

  constructor : function() {
    this.data = toura.app.DeviceStorage.get(this.key) || [];
  },

  put : function() {
    this.inherited(arguments);
    this._save();
  },

  remove : function() {
    this.inherited(arguments);
    this._save();
  },

  query : function(query, opts) {
    if (!query) {
      return dojo.store.util.QueryResults(this.data);
    }

    return this.inherited(arguments);
  },

  _save : function() {
    toura.app.DeviceStorage.set(this.key, this.data);
  }
});
