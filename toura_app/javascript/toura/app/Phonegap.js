dojo.provide('toura.app.Phonegap');

dojo.require('toura.app.Phonegap.notification');
dojo.require('toura.app.Phonegap.device');
dojo.require('toura.app.Phonegap.network');
dojo.require('toura.app.Phonegap.analytics');
dojo.require('toura.app.Phonegap.audio');
dojo.require('toura.app.Phonegap.push');
dojo.require('toura.app.Phonegap.browser');

(function() {

  toura.app.Phonegap.registerAPI = function(name, module) {
    var s = dojo.subscribe('/app/start', function() {
      var device = toura.app.Config.get('device'),
          phonegapPresent = toura.app.Phonegap.present = window.device && window.device.phonegap;

      toura.app.Phonegap[name] = module(phonegapPresent, device);
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
    toura.app.Phonegap.registerAPI(apiName, toura.app.Phonegap[apiName]);
  });
}());
