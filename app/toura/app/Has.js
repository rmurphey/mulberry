dojo.provide('toura.app.Has');

toura.app.Has = function() {
  var device = toura.app.Config.get('device');

  return {
    cssBackgroundContain : function() {
      return !(device.os === 'android' && device.version === '2-1');
    },

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
