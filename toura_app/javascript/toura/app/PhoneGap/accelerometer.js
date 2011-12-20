dojo.provide('toura.app.PhoneGap.accelerometer');

toura.app.PhoneGap.accelerometer = function(pg, device) {
  var noop = function(){};

  return {
    getCurrentAcceleration : function(success, error) {
      var dfd = new dojo.Deferred(),

          win = function(data) {
            (success || noop)(data);
            dfd.resolve(data);
          },

          fail = function(msg) {
            (error || noop)(msg);
            dfd.reject(msg);
          },

          failMsg = 'Accelerometer API not available';

      if (navigator.accelerometer && navigator.accelerometer.getCurrentAcceleration) {
        navigator.accelerometer.getCurrentAcceleration(win, fail);
      } else {
        fail(failMsg);
      }

      return dfd.promise;
    },

    watchAcceleration : function(success, error) {
      if (navigator.accelerometer && navigator.accelerometer.watchAcceleration) {
        return navigator.accelerometer.watchAcceleration(success, error);
      } else {
        return false;
      }
    },

    clearWatch : function(watch) {
      var watchId = watch.watchId || watch;

      if (navigator.accelerometer && navigator.accelerometer.clearWatch && watchId) {
        navigator.accelerometer.clearWatch(watchId);
      }
    }
  };
};
