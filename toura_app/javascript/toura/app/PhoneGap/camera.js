dojo.provide('toura.app.PhoneGap.camera');

toura.app.PhoneGap.registerAPI('camera', function(pg, device) {
  return {
    getPicture : function(success, error, opts) {
      var dfd = new dojo.Deferred(),

          win = function(data) {
            (success || function() {})(data);
            dfd.resolve(data);
          },

          fail = function(msg) {
            (error || function() {})(msg);
            dfd.reject(msg);
          };

      if (pg && navigator && navigator.camera) {
        navigator.camera.getPicture(win, fail, opts);
      } else {
        dfd.resolve();
      }

      return dfd.promise;
    }
  }
});
