dojo.provide('toura.app.Phonegap.analytics');

toura.app.Phonegap.analytics = function(pg, device) {
  var os = device.os,
      appName;

  return {
    log : (function() {
      function getAppName() {
        appName = appName || toura.app.Config.get('app').name.replace(/[^a-zA-Z]/g, '');
        return appName;
      }

      return toura.app.Phonegap.present ?
        function(evt, params) {
          console.log('toura.app.Phonegap::logAnalyticsEvent()');
          PhoneGap.exec(
            function() {},
            function(error) { toura.log("Could not log flurry event.  Error: " + error); },
            'FlurryCommand', 'logEvent', [evt, params]
          );
        }
        :
        function(evt, params) {
          console.log('toura.app.Phonegap::logAnalyticsEvent()');
        };

    }())
  };
};
