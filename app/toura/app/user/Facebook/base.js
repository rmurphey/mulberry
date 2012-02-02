dojo.provide('toura.app.user.Facebook.base');

dojo.require('toura.Device');
dojo.require('toura.app.Sharing');
dojo.require('toura.app.PhoneGap');

dojo.require('toura.app.user.Facebook.android');
dojo.require('toura.app.user.Facebook.ios');
dojo.require('toura.app.user.Facebook.browser');

dojo.declare('toura.app.user.Facebook.base', [], {
  token : null,

  constructor : function() {
    var self = this;

    this.device = toura.Device;

    dojo.mixin(this, toura.app.user.Facebook[
      toura.app.PhoneGap.present ? this.device.os : 'browser'
    ]);

    var key = toura.app.Config.get('app').facebookApiKey;

    if (key) {
      this.init(key);
    } else {
      this.disabled = true;
    }
  },

  isAuthenticated : function() {
    console.log('toura.app.user.Facebook::isAuthenticated()');
    return !!this.token;
  },

  postMessage : function(msg) {
    console.log('toura.app.user.Facebook::postMessage()');

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
    console.log('toura.app.user.Facebook::_getAuth()');
    return this.token || this._realGetAuth().promise;
  }
});
