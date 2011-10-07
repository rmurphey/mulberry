dojo.provide('toura.app.Bootstrapper');

dojo.require('toura.app.Phonegap');
dojo.require('toura.app.DeviceStorage');
dojo.require('toura.models.Tour');

dojo.requireLocalization('toura', 'toura');

toura.app.Bootstrapper = function() {
  var dfd = new dojo.Deferred(),
      app = toura.app,
      tour;

  // open up the database connection so we can work with it
  app.DeviceStorage.init(app.Config.get("id"));
  // app.DeviceStorage.drop();

  tour = toura.app.Tour = new toura.models.Tour({
    bundleDataUrl : toura.localDataUrl || ('./data/tour.js' + (app.Phonegap.present ? '.jet' : '')),
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

        alert(
          dojo.i18n.getLocalization(
            "toura", "toura", toura.app.Config.get("locale")
          ).OTA_UPDATE_NOTICE
        );

        toura.app.Router.home();
      });
    });
  });

  tour.bootstrap().then(dfd.resolve, dfd.reject);

  return dfd.promise;
};
