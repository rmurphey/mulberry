dojo.provide('toura.base');

/**
 * Logging wrapper
 *
 * This needs to come before anything else.
 */
toura.data = toura.data || {};
mulberry = toura;

dojo.require('toura.Utilities');
dojo.require('toura._Logging');
dojo.require('toura.app._base');

dojo.requireLocalization('toura', 'toura');

var readyFn = function() {
  toura.features = toura.features || {};

  dojo.publish('/app/start');

  toura.logSection('Bootstrapper');

  dojo.when(toura.app.Bootstrapper(), function() {

    toura.endLogSection('Bootstrapper');

    // things to do once we know we have data to work with

    dojo.when(toura.app.Tour.getItems(), function(data) {
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
        toura.app.Phonegap.network.isReachable().then(
          function(reachable) {
            toura.app.Local.templates().then(function() {
              toura.app.Router = new toura.app.Router({ routes : toura.app.Routes() });
              toura.app.Router.init();

              toura.app.UI.hideSplash();

              if (!reachable) {
                alert(
                  dojo.i18n.getLocalization(
                    "toura", "toura", toura.app.Config.get("locale")
                  ).STARTUP_NO_NETWORK
                );
              }

              dojo.publish('/app/started');
            });

          }
        );
      }, 200);
    });

  });

  //>>excludeStart('production', kwArgs.production);
  if (toura.features.debugToolbar) { toura.app._Debug(); }
  //>>excludeEnd('production');
};

document.addEventListener("deviceready", function() {
  dojo.ready(readyFn);
}, false);
