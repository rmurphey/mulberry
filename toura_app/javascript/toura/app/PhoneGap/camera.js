dojo.provide('toura.app.PhoneGap.camera');

toura.app.PhoneGap.camera = function(pg, device) {
  var noop = function() {};

  return {
    getPicture : function(success, error, opts) {
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
          };

      if (pg && navigator && navigator.camera) {
        navigator.camera.getPicture(win, fail, opts);
      } else {
        dfd.resolve();
      }

      return dfd.promise;
    }
  };
};
