dojo.provide('toura.UI');

dojo.subscribe('/app/deviceready', function() {
  var b = dojo.body();

  dojo.forIn(toura.features, function(feature, enabled) {
    if (enabled) {
      dojo.addClass(b, 'feature-' + feature);
    }
  });
});
