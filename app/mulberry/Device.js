dojo.provide('mulberry.Device');

dojo.require('mulberry.app.Config');

mulberry._loadDeviceConfig = function() {

  function getDeviceType() {
    var body = dojo.body(),
        minDim = Math.min(body.offsetWidth, body.offsetHeight);

    return minDim > 640 ? 'tablet' : 'phone';
  }

  mulberry.Device = mulberry.app.Config.get('device') || {
    type : getDeviceType(),
    os : 'browser'
  };

};

mulberry._loadDeviceConfig();
