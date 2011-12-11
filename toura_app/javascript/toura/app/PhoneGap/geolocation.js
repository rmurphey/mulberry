dojo.provide('toura.app.PhoneGap.geolocation');

toura.app.PhoneGap.geolocation = function(pg, device) {
  var noop = function(){};

  return {
    getCurrentPosition : function(success, error, opts) {
      var dfd = new dojo.Deferred(),

          win = function(data) {
            (success || noop)(data);
            dfd.resolve(data);
          },

          fail = function(msg) {
            (error || noop)(msg);
            dfd.reject(msg);
          },

          failMsg = 'Geolocation API not available';

      if (navigator.geolocation && navigator.geolocation.getCurrentPosition) {
        navigator.geolocation.getCurrentPosition(win, fail, opts);
      } else {
        fail(msg);
      }

      return dfd.promise;
    },

    watchPosition : function(success, error, opts) {
      var dfd = new dojo.Deferred(),

          win = function(data) {
            (success || noop)(data);
            dfd.resolve(data);
          },

          fail = function(msg) {
            (error || noop)(msg);
            dfd.reject(msg);
          },

          watchId;

      if (navigator.geolocation && navigator.geolocation.watchPosition) {
        dfd.promise.watchId = navigator.geolocation.watchPosition(win, fail, opts);
      } else {
        dfd.promise.watchId = true;
      }
    },

    clearWatch : function(watch) {
      var watchId = watch.watchId || watch;

      if (navigator.geoLocation && navigator.geolocation.clearWatch && watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    }
  };
};
