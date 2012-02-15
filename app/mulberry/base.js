dojo.provide('mulberry.base');

$m = mulberry;
mulberry.version = '0.3';

dojo.require('mulberry.app.Config');

dojo.require('mulberry.Device');

dojo.require('mulberry._Logging');
dojo.require('mulberry._PageDef');
dojo.require('mulberry._Store');
dojo.require('mulberry._Model');
dojo.require('mulberry._Capability');

dojo.require('mulberry.Utilities');

dojo.require('mulberry.app._base');

dojo.requireLocalization('mulberry', 'mulberry');

var readyFn = function() {
  // bootstrapping process should start in response to /app/deviceready
  dojo.publish('/app/deviceready');

  // bootstrapping process must publish this topic
  dojo.subscribe('/app/ready', function() {
    mulberry.app.Router.init();
    mulberry.app.UI.hideSplash();
  });

  //>>excludeStart('production', kwArgs.production);
  if (mulberry.features && mulberry.features.debugToolbar) { mulberry.app._Debug(); }
  //>>excludeEnd('production');
};

document.addEventListener("deviceready", function() {
  dojo.ready(readyFn);
}, false);
