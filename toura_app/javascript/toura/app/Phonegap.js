dojo.provide('toura.app.Phonegap');

dojo.require('toura.app.Phonegap.device');
dojo.require('toura.app.Phonegap.network');
dojo.require('toura.app.Phonegap.analytics');
dojo.require('toura.app.Phonegap.audio');
dojo.require('toura.app.Phonegap.push');
dojo.require('toura.app.Phonegap.browser');

(function() {

  var subscription = dojo.subscribe('/app/start', function() {

    var tap = toura.app.Phonegap,
        device = toura.app.Config.get('device'),
        phonegapPresent = tap.present = window.device && window.device.phonegap;

    /**
     * To add more functionality, create a module in the toura.app.Phonegap
     * namespace. The module itself should reference a function that returns an
     * object. So, toura.app.Phonegap.device is a function that returns the
     * toura.app.Phonegap.device.* methods and properties.
     *
     * Be sure to add the module's name to the list below AND to the list of
     * requires at the top of this file.
     */
    dojo.forEach([
      'device',
      'network',
      'analytics',
      'audio',
      'push',
      'browser'
    ], function(item) {
      if (!tap[item]) {
        throw 'No such phonegap item ' + item;
      }

      tap[item] = tap[item](phonegapPresent, device);
    });

    dojo.unsubscribe(subscription);
  });

}());
