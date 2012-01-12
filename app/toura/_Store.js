dojo.provide('toura._Store');

dojo.require('dojo.store.Memory');

dojo.declare('toura._Store', dojo.store.Memory, {
  add : function(item) {
    item = this._createModel(item);
    this.put(item);
  },

  get : function(id) {
    var item = this.inherited(arguments);
    return this._createModel(item);
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
    var results = query ? this.inherited(arguments) : dojo.store.util.QueryResults(this.data);
    return results.map(dojo.hitch(this, '_createModel'));
  },

  setData : function(data) {
    this.inherited(arguments);
    this._save();
  },

  prepareData : function(data) {
    return data;
  },

  process : function(data) {
    data = this.prepareData(data);

    if (this.model && client.models[this.model]) {
      data = this._createModels(data);
    }

    return data;
  },

  invoke : function(ids, fn) {
    ids = dojo.isArray(ids) ? ids : [ ids ];

    var models = dojo.map(ids, function(id) {
      var item = this.get(id);

      dojo.hitch(item, fn)(item);

      this.put(item);

      return item;
    }, this);

    return dojo.store.util.QueryResults(models);
  },

  _createModel : function(item) {
    if (this.model && client.models[this.model]) {
      item = new client.models[this.model](item);
      item.format();
    } else {
      console.warn('No model for ' + this.declaredClass);
    }

    if (!item.id) {
      item.id = this._createId();
    }

    return item;
  },

  _createModels : function(data) {
    return dojo.map(data, dojo.hitch(this, '_createModel'));
  },

  _save : function() {
    toura.app.DeviceStorage.set(this.key, this.data);
  },

  _createId : function() {
    return (((1+Math.random())*0x10000)).toString(16).substring(1);
  }
});

toura.store = function(name, proto) {
  dojo.declare(
    'client.stores.' + name,
    toura._Store,
    dojo.mixin({
      key : name,
      data : toura.app.DeviceStorage.get(name)
    }, proto)
  );

  client.stores[name] = new client.stores[name]();
};
