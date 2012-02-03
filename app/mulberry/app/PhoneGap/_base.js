dojo.provide('mulberry.app.PhoneGap._base');

dojo.require('mulberry.Device');

mulberry.app.PhoneGap.registerAPI = function(name, module) {
  var s = dojo.subscribe('/app/deviceready', function() {
    var device = mulberry.Device,
        phonegapPresent = mulberry.app.PhoneGap.present = window.device && window.device.phonegap;

    mulberry.app.PhoneGap[name] = module(phonegapPresent, device);
    dojo.unsubscribe(s);
  });
};

