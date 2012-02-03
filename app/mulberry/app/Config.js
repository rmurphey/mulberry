dojo.provide('mulberry.app.Config');

(function(d, undef) {

var privateConfig = {};

mulberry.app.Config = {
  get : function(key) {
    return privateConfig[key];
  },

  set : function(key, val) {
    privateConfig = privateConfig || {};
    privateConfig[key] = val;
  },

  registerConfig : function(config) {
    privateConfig = config || {};
  }
};

if (mulberry._Config) {
  mulberry.app.Config.registerConfig(mulberry._Config);
}

}(dojo));
