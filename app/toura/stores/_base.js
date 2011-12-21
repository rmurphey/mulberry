dojo.provide('toura.stores._base');

dojo.require('dojo.store.Memory');
dojo.require('toura.stores._LocalStore');

dojo.mixin(toura.stores, {
  remote : function(name, proto) {
    client.stores[name] = new dojo.store.Memory(proto);
  },

  local : function(name, proto) {
    dojo.declare(
      'client.stores.' + name,
      toura.stores._LocalStore,
      dojo.mixin({
        key : name,
        data : toura.app.DeviceStorage.get(name)
      }, proto)
    );

    client.stores[name] = new client.stores[name]();
  }
});
