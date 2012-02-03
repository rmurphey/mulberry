dojo.provide('mulberry.app.PhoneGap.analytics');

mulberry.app.PhoneGap.analytics = function(pg, device) {
  var os = device.os,
      appName;

  return {
    log : (function() {
      function getAppName() {
        appName = appName || mulberry.app.Config.get('app').name.replace(/[^a-zA-Z]/g, '');
        return appName;
      }

      return pg ?
        function(evt, params) {
          console.log('mulberry.app.PhoneGap::logAnalyticsEvent()');
          PhoneGap.exec(
            function() {},
            function(error) { mulberry.log("Could not log flurry event.  Error: " + error); },
            'FlurryCommand', 'logEvent', [evt, params]
          );
        }
        :
        function(evt, params) {
          console.log('mulberry.app.PhoneGap::logAnalyticsEvent()');
        };

    }())
  };
};
