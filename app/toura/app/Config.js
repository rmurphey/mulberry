dojo.provide('toura.app.Config');

(function(d, undef) {

var privateConfig = {};

function getDeviceType() {
  var body = dojo.body(),
      minDim = Math.min(body.offsetWidth, body.offsetHeight);

  return minDim > 640 ? 'tablet' : 'phone';
}

toura.app.Config = {
  get : function(key) {
    var val = privateConfig[key];

    if (key === 'device' && !val) {
      val = {
        type : getDeviceType(),

        // TODO: set this to "browser" in this case
        os : 'ios'
      };

      this.set('device', val);
    }

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
