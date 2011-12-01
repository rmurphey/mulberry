dojo.provide('toura.stores._base');

dojo.require('toura.stores._LocalStore');

toura.stores = {
  custom : function(name, proto) {
    return dojo.declare('client.stores.' + name, null, proto);
  },

  local : function(name, proto) {
    return dojo.declare('client.stores.' + name, toura.stores._LocalStore, proto);
  }
};
