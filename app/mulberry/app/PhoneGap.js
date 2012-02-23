dojo.provide('mulberry.app.PhoneGap');

dojo.require('mulberry.Device');
dojo.require('mulberry.app.PhoneGap.notification');
dojo.require('mulberry.app.PhoneGap.device');
dojo.require('mulberry.app.PhoneGap.network');
dojo.require('mulberry.app.PhoneGap.audio');
dojo.require('mulberry.app.PhoneGap.push');
dojo.require('mulberry.app.PhoneGap.browser');
dojo.require('mulberry.app.PhoneGap.camera');
dojo.require('mulberry.app.PhoneGap.geolocation');
dojo.require('mulberry.app.PhoneGap.accelerometer');

(function() {

  mulberry.app.PhoneGap.registerAPI = function(name, module) {
    var s = dojo.subscribe('/app/deviceready', function() {
      var device = mulberry.Device,
          phonegapPresent = mulberry.app.PhoneGap.present = window.device && window.device.phonegap;

      mulberry.app.PhoneGap[name] = module(phonegapPresent, device);
      dojo.unsubscribe(s);
    });
  };

  var builtInAPIs = [
    'notification',
    'device',
    'network',
    'audio',
    'push',
    'browser',
    'camera',
    'geolocation',
    'accelerometer'
  ];

  dojo.forEach(builtInAPIs, function(apiName) {
    mulberry.app.PhoneGap.registerAPI(apiName, mulberry.app.PhoneGap[apiName]);
  });
}());
