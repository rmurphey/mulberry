dojo.provide('toura.app.PhoneGap.geolocation');

toura.app.PhoneGap.geolocation = function(pg, device) {
  var noop = function(){};

  return {
    getCurrentPosition : function(success, error, opts) {
      if (!dojo.isFunction(success)) {
        opts = success;
        success = false;
        error = false;
      }

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
        fail(failMsg);
      }

      return dfd.promise;
    },

    watchPosition : function(success, error, opts) {
      if (navigator.geolocation && navigator.geolocation.watchPosition) {
        return navigator.geolocation.watchPosition(success, error, opts);
      }

      return false;
    },

    clearWatch : function(watch) {
      if (watch && navigator.geolocation && navigator.geolocation.clearWatch) {
        navigator.geolocation.clearWatch(watch);
      }
    }
  };
};
