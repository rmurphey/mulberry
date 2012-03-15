dojo.provide('toura.models.Tour');

dojo.require('toura.models._Updateable');
dojo.require('mulberry.app.DeviceStorage');

dojo.declare('toura.models.Tour', toura.models._Updateable, {
  storageKey : 'tour',

  getItems : function() {
    var dfd = new dojo.Deferred();

    if (this._items) {
      dfd.resolve(this._items);
    } else {
      mulberry.app.DeviceStorage.get('tour')
        .then(dojo.hitch(this, function(items) {
          this._items = items;
          dfd.resolve(items);
        }));
    }

    return dfd.promise;
  },

  _store : function(data, newRemoteData) {
    this.inherited(arguments);

    var dfd = new dojo.Deferred(),
        storeOnDevice;

    if (data.app) {
      mulberry.app.DeviceStorage.set('app', data.app);
    }

    if (data.items) {
      storeOnDevice = mulberry.app.DeviceStorage.set('tour', data.items);

      if (newRemoteData) {
        // if what we're storing is new remote data, then we should
        // wait until it's stored before we resolve the deferred
        storeOnDevice.then(function() { dfd.resolve(true); });
      } else {
        // if it's not new remote data, we don't need to wait until it's
        // stored; we can just proceed immediately.
        dfd.resolve(true);
      }
    }

    return dfd.promise;
  },

  getBundleData : function() {
    var dfd = new dojo.Deferred();
    dfd.resolve(toura.data.local);
    return dfd.promise;
  },

  _onDataReady : function() {
    var appConfig = mulberry.app.DeviceStorage.get('app');
    mulberry.app.Config.set('app', appConfig);
  }
});

