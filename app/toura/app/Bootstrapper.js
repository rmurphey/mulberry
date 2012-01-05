dojo.provide('toura.app.Bootstrapper');

dojo.require('toura.app.PhoneGap');
dojo.require('toura.app.DeviceStorage');
dojo.require('toura.models.Tour');

dojo.requireLocalization('toura', 'toura');

(function() {

var bootstrapper = function() {
  var dfd = new dojo.Deferred(),
      app = toura.app,
      tour;

  // open up the database connection so we can work with it
  app.DeviceStorage.init(app.Config.get("id"));
  // app.DeviceStorage.drop();

  tour = new toura.models.Tour({
    bundleDataUrl : toura.localDataUrl || ('./data/tour.js' + (app.PhoneGap.present ? '.jet' : '')),
    remoteDataUrl : app.Config.get('updateUrl'),
    remoteVersionUrl : app.Config.get('versionUrl')
  });

  dojo.subscribe('/page/transition/end', function() {
    // how long has it been since we last checked for an update?
    var lastChecked = tour.lastChecked,
        now = new Date().getTime(),
        since = now - lastChecked,
        maxTime = 1000 * 60 * 60 * (toura.otaInterval || 8), // 8 hours
        outdated = since > maxTime;

    if (!outdated) { return; }

    tour.bootstrap().then(function(gotUpdate) {
      if (!gotUpdate) { return; }

      dojo.when(toura.app.Tour.getItems(), function(data) {
        toura.app.Data.loadData(data);

        toura.app.PhoneGap.notification.alert(
          dojo.i18n.getLocalization(
            "toura", "toura", toura.app.Config.get("locale")
          ).OTA_UPDATE_NOTICE
        );

        toura.app.Router.home();
      });
    });
  });

  tour.bootstrap().then(function() {
    dfd.resolve(tour);
  }, dfd.reject);

  return dfd.promise;
};

dojo.subscribe('/app/deviceready', function() {

  bootstrapper().then(function(tour) {

    tour.getItems().then(function(data) {

      //>>excludeStart('production', kwArgs.production);
      if (toura.extraTourData && dojo.isArray(toura.extraTourData)) {
        dojo.forEach(toura.extraTourData, function(item) {
          data.push(item);
        });
      }
      //>>excludeEnd('production');

      toura.app.Data = new toura.app.Data(data);

      // this timeout is here to avoid a nasty problem with webkit
      // where reading a node's innerHTML will not work correctly;
      // this bug manifests itself with an "Invalid template" error,
      // which will make no sense because the template is perfectly
      // valid. this error will only appear intermittently, and almost
      // exclusively on device. long story short:
      //
      // DO NOT REMOVE THIS TIMEOUT
      //

      setTimeout(function() {
        dojo.publish('/app/ready');

        toura.app.PhoneGap.network.isReachable().then(
          function(reachable) {
            if (!reachable) {
              toura.app.PhoneGap.notification.alert(
                dojo.i18n.getLocalization(
                  "toura", "toura", toura.app.Config.get("locale")
                ).STARTUP_NO_NETWORK
              );
            }
          }
        );
      }, 200);
    });

  });

});

}());
