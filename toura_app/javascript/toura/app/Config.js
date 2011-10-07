dojo.provide('toura.app.Config');

if (!toura.app._Config) {
  // prevent toura.app._Config from being included
  // in the built files
  var req = dojo.require;
  req('toura.app.TouraConfig');
}

(function(d, undef) {

var privateConfig;

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
    privateConfig[key] = val;
  },

  registerConfig : function(config) {
    privateConfig = config;
  }
};

toura.app.Config.registerConfig(toura.app._Config);

}(dojo));
