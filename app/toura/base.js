dojo.provide('toura.base');

dojo.require('toura.xhr');
dojo.require('toura.Analytics');
dojo.require('toura.Bootstrapper');
dojo.require('toura.Data');
dojo.require('toura.Manifest');
dojo.require('toura.Routes');
dojo.require('toura.Sharing');
dojo.require('toura.URL');
dojo.require('toura.capabilities._base');
dojo.require('toura.components._base');

toura.data = toura.data || {};

mulberry.registerComponentNamespace(toura.components);
mulberry.registerCapabilityNamespace(toura.capabilities);

(function() {

dojo.subscribe('/app/deviceready', function() {
  var b = dojo.body();

  dojo.forIn(toura.features, function(feature, enabled) {
    if (enabled) {
      dojo.addClass(b, 'feature-' + feature);
    }
  });

  mulberry.components.Debug.registerFeatureObject(toura.features);
});
}());
