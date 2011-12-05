dojo.provide('toura.stores._base');

dojo.require('toura.stores._LocalStore');

dojo.mixin(toura.stores, {
  custom : function(name, proto) {
    return dojo.declare('client.stores.' + name, null, proto);
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
