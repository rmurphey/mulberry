dojo.provide('toura.models.Tour');

dojo.require('toura.models._Updateable');

dojo.declare('toura.models.Tour', [ toura.models._Updateable ], {
  storageKey : 'tour',

  _store : function(data) {
    this.inherited(arguments);

    var dfd = new dojo.Deferred();

    if (data.app) {
      toura.app.DeviceStorage.set('app', data.app);
    }

    if (data.items) {
      toura.app.DeviceStorage.set('tour', data.items)
        .then(function() { dfd.resolve(true); });
    }

    return dfd.promise;
  },

  getItems : function() {
    if (this._items) {
      return this._items;
    }

    var dfd = new dojo.Deferred();

    toura.app.DeviceStorage.get('tour')
      .then(dojo.hitch(this, function(items) {
        if (toura.extraRawTourData && dojo.isArray(toura.extraRawTourData)) {
          dojo.forEach(toura.extraRawTourData, function(item) { items.push(item); });
        }

        this._items = items;
        dfd.resolve(items);
      }));

    return dfd.promise;
  },

  _processBundleData : function() {
    return toura.data.local;
  },

  _onDataReady : function() {
    var appConfig = toura.app.DeviceStorage.get('app'); 

    toura.app.Config.set('app', appConfig);
    window.TouraAppConfig = appConfig;
  }
});

