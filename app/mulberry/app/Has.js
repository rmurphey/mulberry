dojo.provide('mulberry.app.Has');

dojo.require('mulberry.Device');

mulberry.app.Has = function() {
  var device = mulberry.Device;

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
  if (dojo.isFunction(mulberry.app.Has)) {
    mulberry.app.Has = mulberry.app.Has();
  }
});

}());
