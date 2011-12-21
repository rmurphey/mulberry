dojo.provide('toura.app.user.Facebook.browser');

toura.app.user.Facebook.browser = {
  init : function(appId) {
    if (!toura.features.socialInBrowser) { return; }

    window.fbAsyncInit = function() {
      FB.init({ appId : appId });
    };

    var e = document.createElement('script');
    e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
    e.async = true;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(e, s);
  },

  _realGetAuth : function() {
    var dfd = new dojo.Deferred();

    if (FB) {
      FB.login(function(resp) {
        dfd.resolve(resp.session && resp.session.access_token);
      }, { perms : 'publish_stream' });
    } else {
      dfd.resolve();
    }

    return dfd;
  },

  _postMessage : function(msg) {
    var dfd = new dojo.Deferred();

    if (FB) {
      FB.api('/me/feed', 'post', { message : msg }, function(resp) {
        if (!resp || resp.error) {
          dfd.reject(resp && resp.error);
        } else {
          dfd.resolve();
        }
      });
    } else {
      dfd.resolve();
    }

    return dfd.promise;
  }
};
