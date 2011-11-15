dojo.provide('toura.app.PhoneGap.analytics');

toura.app.PhoneGap.analytics = function(pg, device) {
  var os = device.os,
      appName;

  return {
    log : (function() {
      function getAppName() {
        appName = appName || toura.app.Config.get('app').name.replace(/[^a-zA-Z]/g, '');
        return appName;
      }

      return pg ?
        function(evt, params) {
          console.log('toura.app.PhoneGap::logAnalyticsEvent()');
          PhoneGap.exec(
            function() {},
            function(error) { toura.log("Could not log flurry event.  Error: " + error); },
            'FlurryCommand', 'logEvent', [evt, params]
          );
        }
        :
        function(evt, params) {
          console.log('toura.app.PhoneGap::logAnalyticsEvent()');
        };

    }())
  };
};
