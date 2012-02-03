dojo.provide('toura.user.Facebook.base');

dojo.require('mulberry.Device');
dojo.require('toura.Sharing');
dojo.require('mulberry.app.PhoneGap');

dojo.require('toura.user.Facebook.android');
dojo.require('toura.user.Facebook.ios');
dojo.require('toura.user.Facebook.browser');

dojo.declare('toura.user.Facebook.base', null, {
  token : null,

  constructor : function() {
    var self = this;

    this.device = mulberry.Device;

    dojo.mixin(this, toura.user.Facebook[
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
    console.log('toura.user.Facebook::isAuthenticated()');
    return !!this.token;
  },

  postMessage : function(msg) {
    console.log('toura.user.Facebook::postMessage()');

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
    console.log('toura.user.Facebook::_getAuth()');
    return this.token || this._realGetAuth().promise;
  }
});
