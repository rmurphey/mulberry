dojo.provide('mulberry.app.user.Facebook.base');

dojo.require('mulberry.Device');
dojo.require('mulberry.app.Sharing');
dojo.require('mulberry.app.PhoneGap');

dojo.require('mulberry.app.user.Facebook.android');
dojo.require('mulberry.app.user.Facebook.ios');
dojo.require('mulberry.app.user.Facebook.browser');

dojo.declare('mulberry.app.user.Facebook.base', [], {
  token : null,

  constructor : function() {
    var self = this;

    this.device = mulberry.Device;

    dojo.mixin(this, mulberry.app.user.Facebook[
      mulberry.app.PhoneGap.present ? this.device.os : 'browser'
    ]);

    var key = mulberry.app.Config.get('app').facebookApiKey;

    if (key) {
      this.init(key);
    } else {
      this.disabled = true;
    }
  },

  isAuthenticated : function() {
    console.log('mulberry.app.user.Facebook::isAuthenticated()');
    return !!this.token;
  },

  postMessage : function(msg) {
    console.log('mulberry.app.user.Facebook::postMessage()');

    if (!msg) { return; }

    var dfd = new dojo.Deferred();

    dojo.when(this._getAuth(), dojo.hitch(this, function(t) {
      this.token = t;
      this._postMessage(msg, t).then(dfd.resolve, dfd.reject);
    }));

    return dfd.promise;
  },

  _postMessage : function(msg, token) {
    var url = 'https://graph.facebook.com/me/feed' + '?' + dojo.objectToQuery({
      message : msg,
      link : '',
      picture : ''
    }) + '&access_token=' + token;

    return dojo.xhrPost({ url : url });
  },

  _getAuth : function() {
    console.log('mulberry.app.user.Facebook::_getAuth()');
    return this.token || this._realGetAuth().promise;
  }
});
