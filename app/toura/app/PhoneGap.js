dojo.provide('toura.app.PhoneGap');

dojo.require('toura.Device');
dojo.require('toura.app.PhoneGap._base');
dojo.require('toura.app.PhoneGap.notification');
dojo.require('toura.app.PhoneGap.device');
dojo.require('toura.app.PhoneGap.network');
dojo.require('toura.app.PhoneGap.analytics');
dojo.require('toura.app.PhoneGap.audio');
dojo.require('toura.app.PhoneGap.push');
dojo.require('toura.app.PhoneGap.browser');
dojo.require('toura.app.PhoneGap.camera');
dojo.require('toura.app.PhoneGap.geolocation');
dojo.require('toura.app.PhoneGap.accelerometer');

(function() {

  toura.app.PhoneGap.registerAPI = function(name, module) {
    var s = dojo.subscribe('/app/deviceready', function() {
      var device = toura.Device,
          phonegapPresent = toura.app.PhoneGap.present = window.device && window.device.phonegap;

      toura.app.PhoneGap[name] = module(phonegapPresent, device);
      dojo.unsubscribe(s);
    });
  };

  var builtInAPIs = [
    'notification',
    'device',
    'network',
    'analytics',
    'audio',
    'push',
    'browser',
    'camera',
    'geolocation',
    'accelerometer'
  ];

  dojo.forEach(builtInAPIs, function(apiName) {
    toura.app.PhoneGap.registerAPI(apiName, toura.app.PhoneGap[apiName]);
  });
}());
