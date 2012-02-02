dojo.provide('toura.Device');

(function() {

var device;

function getDeviceType() {
  var body = dojo.body(),
      minDim = Math.min(body.offsetWidth, body.offsetHeight);

  return minDim > 640 ? 'tablet' : 'phone';
}

try {
  device = toura.app.Config.get('device');
} catch(e) {
  device = {
    os : 'browser',
    type : getDeviceType()
  };
}

toura.Device = device;

}());
