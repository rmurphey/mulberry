dojo.provide('toura._Store');

dojo.require('dojo.store.Memory');

dojo.declare('toura._Store', dojo.store.Memory, {
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
  }
});

toura.store = function(name, proto) {
  dojo.declare(
    'client.stores.' + name,
    toura._Store,
    dojo.mixin({
      key : name,
      data : toura.app.DeviceStorage.get(name),

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

      _createModels : function(data) {
        return dojo.map(data, function(item) {
          var m = new client.models[this.model](item);
          m.format();
          return m;
        }, this);
      }
    }, proto)
  );

  client.stores[name] = new client.stores[name]();
};

toura.model = function(name, proto) {
  dojo.declare(
    'client.models.' + name,
    dojo.Stateful,
    dojo.mixin({
      format : function(item) {}
    }, proto)
  );
};
