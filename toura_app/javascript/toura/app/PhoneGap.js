dojo.provide('toura.app.PhoneGap');

dojo.require('toura.app.PhoneGap.notification');
dojo.require('toura.app.PhoneGap.device');
dojo.require('toura.app.PhoneGap.network');
dojo.require('toura.app.PhoneGap.analytics');
dojo.require('toura.app.PhoneGap.audio');
dojo.require('toura.app.PhoneGap.push');
dojo.require('toura.app.PhoneGap.browser');

(function() {

  toura.app.PhoneGap.registerAPI = function(name, module) {
    var s = dojo.subscribe('/app/deviceready', function() {
      var device = toura.app.Config.get('device'),
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
    'browser'
  ];

  dojo.forEach(builtInAPIs, function(apiName) {
    toura.app.PhoneGap.registerAPI(apiName, toura.app.PhoneGap[apiName]);
  });
}());
