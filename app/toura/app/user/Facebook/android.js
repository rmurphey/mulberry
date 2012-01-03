dojo.provide('toura.app.user.Facebook.android');

toura.app.user.Facebook.android = {
  init : function(appId) {
    this.appId = appId;
    // https://github.com/jos3000/phonegap-plugins/tree/master/Android/Facebook

    (function(){
      /**
       * Constructor
       */
      function Facebook() {}

      /**
       * Logs into facebook
       *
       * @param app_id        Your facebook app_id
       * @param callback      called when logged in
       */
      Facebook.prototype.authorize = function(app_id, callback) {
        PhoneGap.exec(callback, null, "FacebookAuth", "authorize", [app_id]);
      };

      Facebook.prototype.request = function(path, callback) {
        PhoneGap.exec(callback, null, "FacebookAuth", "request", [path]);
      };

      Facebook.prototype.getAccess = function(callback) {
        PhoneGap.exec(callback, null, "FacebookAuth", "getAccess", []);
      };

      /**
       * Load Plugin
       */
      PhoneGap.addConstructor(function() {
        PhoneGap.addPlugin("facebook", new Facebook());
        PluginManager.addService("FacebookAuth", "com.phonegap.plugins.facebook.FacebookAuth");
      });

    }());
  },

  _realGetAuth : function() {
    var dfd = new dojo.Deferred();

    window.plugins.facebook.authorize(this.appId, dojo.hitch(this, function(res) {
      if (res.token) {
        this.token = res.token;
        dfd.resolve(res.token);
      } else {
        window.plugins.facebook.getAccess(dojo.hitch(this, function(res) {
          if(!res.token) {
            dfd.reject();
            return;
          }

          this.token = res.token;
          dfd.resolve(res.token);
        }));
      }
    }));

    return dfd;
  }
};

