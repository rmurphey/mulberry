dojo.provide('toura.app.Has');

toura.app.Has = function() {
  var device = toura.app.Config.get('device');

  return {
    html5Player : function() {
      return device.os !== 'android';
    },

    iScrollZoom : function() {
      return device.os !== 'android';
    }
  };
};

(function(){

var s = dojo.subscribe('/app/deviceready', function() {
  dojo.unsubscribe(s);
  if (dojo.isFunction(toura.app.Has)) {
    toura.app.Has = toura.app.Has();
  }
});

}());
