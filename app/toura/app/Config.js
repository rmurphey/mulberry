dojo.provide('toura.app.Config');

(function(d, undef) {

var privateConfig = {};

toura.app.Config = {
  get : function(key) {
    var val = privateConfig[key];

    if (val === undef) {
      throw "No config value for " + val;
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

if (toura._Config) {
  toura.app.Config.registerConfig(toura._Config);
}

}(dojo));
