dojo.provide('toura.Device');

dojo.require('toura.app.Config');

toura._loadDeviceConfig = function() {

  function getDeviceType() {
    var body = dojo.body(),
        minDim = Math.min(body.offsetWidth, body.offsetHeight);

    return minDim > 640 ? 'tablet' : 'phone';
  }

  toura.Device = toura.app.Config.get('device') || {
    type : getDeviceType(),
    os : 'browser'
  };

};

toura._loadDeviceConfig();
