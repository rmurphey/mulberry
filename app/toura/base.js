dojo.provide('toura.base');

toura.data = toura.data || {};
mulberry = toura;

dojo.require('toura.Utilities');
dojo.require('toura._Logging');
dojo.require('toura.app._base');

dojo.requireLocalization('toura', 'toura');

var readyFn = function() {
  toura.features = toura.features || {};

  // bootstrapping process should start in response to /app/deviceready
  dojo.publish('/app/deviceready');

  // bootstrapping process must publish this topic
  dojo.subscribe('/app/ready', function() {

    // routes should be created in response to /app/started
    dojo.publish('/app/started');

    toura.app.Router.init();
    toura.app.UI.hideSplash();
  });

  //>>excludeStart('production', kwArgs.production);
  if (toura.features && toura.features.debugToolbar) { toura.app._Debug(); }
  //>>excludeEnd('production');
};

document.addEventListener("deviceready", function() {
  dojo.ready(readyFn);
}, false);
