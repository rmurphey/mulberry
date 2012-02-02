dojo.provide('toura.app.PhoneGap._base');

dojo.require('toura.Device');

toura.app.PhoneGap.registerAPI = function(name, module) {
  var s = dojo.subscribe('/app/deviceready', function() {
    var device = toura.Device,
        phonegapPresent = toura.app.PhoneGap.present = window.device && window.device.phonegap;

    toura.app.PhoneGap[name] = module(phonegapPresent, device);
    dojo.unsubscribe(s);
  });
};

