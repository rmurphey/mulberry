dojo.provide('toura.app.Config');

(function(d, undef) {

var privateConfig = {};

toura.app.Config = {
  get : function(key) {
    var val = privateConfig[key];

    if (val === undef) {
      console.error("No config value found for " + key);
      throw new Error("No config value found for " + key);
    }

    return val;
  },

  set : function(key, val) {
    privateConfig = privateConfig || {};
    privateConfig[key] = val;
  },

  registerConfig : function(config) {
    privateConfig = config || {};
  }
};

}(dojo));
