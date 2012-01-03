dojo.provide('toura.app.user.Facebook.ios');

dojo.require('toura.app.PhoneGap');

toura.app.user.Facebook.ios = {
  init : function(appId) {
    this.authUrl = 'https://graph.facebook.com/oauth/authorize?' +

      // parameters to pass when asking fb for auth
      dojo.objectToQuery({
        client_id : appId,
        display : 'touch',
        redirect_uri : 'https://www.facebook.com/connect/login_success.html',
        response_type : 'token',
        scope : 'publish_stream,offline_access'
      });

    this.childBrowser = toura.app.PhoneGap.browser.getBrowser();
  },

  _realGetAuth : function() {
    var dfd = new dojo.Deferred();

    this.childBrowser.showWebPage(this.authUrl);

    this.childBrowser.onLocationChange = dojo.hitch(this, function(loc) {
      var token = this._findToken(loc);
      if (!token) {
        dfd.reject();
        return;
      }

      this.childBrowser.close();
      dfd.resolve(token);
    });

    return dfd;
  },

  // listen for childbrowser to go to successful login url
  _findToken : function(loc) {
    if (loc.indexOf('login_success')) {
      var params = dojo.queryToObject(unescape(loc).split('#')[1]);
      return params.access_token;
    }

    return false;
  }
};
