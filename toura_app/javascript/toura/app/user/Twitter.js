/* jslint bitwise:false */
dojo.provide('toura.app.user.Twitter');

dojo.require('toura.app.PhoneGap');
dojo.require('vendor.sha');

(function(){

var user;

dojo.declare('toura.app.user.Twitter', [], {

  constructor: function() {
    var config = {
      customerKey : toura.app.Config.get('app').twitterCustomerKey,
      customerSecret : toura.app.Config.get('app').twitterCustomerSecret
    };

    if (config.customerKey && config.customerSecret) {
      this.twitterConfig = config;
      if (toura.app.PhoneGap.present) {
        this.childBrowser = toura.app.PhoneGap.browser.getBrowser();
      }
    } else {
      this.disabled = true;
    }
  },

  setUserInfo : function(u) {
    console.log('toura.app.user.Twitter::setUserInfo()');
    if (u.username && u.password) {
      user = u;
      return true;
    }

    return false;
  },

  isAuthenticated : function() {
    console.log('toura.app.user.Twitter::isAuthenticated()');

    if (toura.app.PhoneGap.present) {
      return !!(this.oauth_token && this.oauth_token_secret);
    }

    // always return false for desktop for now;
    // this will make it easier to dev the auth fields
    // in a browser
    return false;
  },

  postMessage : function(msg) {
    console.log('toura.app.user.Twitter::postMessage()');

    if (!msg) { return; }

    if (toura.silenceSharing) {
      console.log('sharing silenced; twitter message would have been', msg);
    }

    var dfd = new dojo.Deferred();

    dojo.when(this._getAuth(), dojo.hitch(this, function(t) {
      this._postMessage(msg, t).then(dfd.resolve, dfd.reject);
    }));

    return dfd.promise;
  },

  _postMessage : function(msg, t) {
    // TODO: twitter won't let you send the same status update twice in succession
    // may want to do some error checking for this
    console.log('toura.app.user.Twitter::_postMessage()');

    var postRequest = new toura.app.user._TwitterAPI({
          customerKey : this.twitterConfig.customerKey,
          consumerSecret : this.twitterConfig.customerSecret
        }),
        auth = this._getAuthTokenFields(),
        dfd = new dojo.Deferred();

    postRequest.setAuth(auth);

    if (!postRequest.setupUpdate(msg)) {
      dfd.reject();
    } else {
      dojo.xhrPost({
        url : postRequest.getPostTarget(),
        headers : postRequest.getAuthHeader(),
        load : dfd.resolve
      });
    }

    return dfd.promise;
  },

  _getAuthTokenFields : function() {
    console.log('toura.app.user.Twitter::_getAuthTokenFields()');
    // TODO: this only has meaning on device
    return {
      oauth_token : this.oauth_token,
      oauth_token_secret : this.oauth_token_secret
    };
  },

  _getAuth :  function() {
    console.log('toura.app.user.Twitter::_getAuth()');

    var dfd = new dojo.Deferred(),
        authRequest;

    // outside phonegap, we can assume auth will happen automatically
    if (!toura.app.PhoneGap.present) {
      dfd.resolve(true);
      return dfd.promise;
    }

    if (this.isAuthenticated()) {
      return this._getAuthTokenFields();
    }

    if (!user) {
      console.error('user not found');
      return;
    }

    authRequest = new toura.app.user._TwitterAPI({
      customerKey : this.twitterConfig.customerKey,
      consumerSecret : this.twitterConfig.customerSecret
    });

    authRequest.setupAuthPost(user.username, user.password);

    dojo.xhrPost({
      url : authRequest.getPostTarget(),
      headers : authRequest.getAuthHeader()
    })
    .then(dojo.hitch(this, function(params) {
      var oauthFields = dojo.queryToObject(params);

      dojo.mixin(this, oauthFields);

      dfd.resolve({
        oauth_token : this.oauth_token,
        oauth_token_secret : this.oauth_token_secret
      });

    }), dfd.reject);

    return dfd.promise;
  }
});

}());

dojo.declare('toura.app.user._TwitterAPI', null, {

  // this is all based on https://gist.github.com/447636 by @alunny

  sigBaseTemplate : "POST&" +
    "{{ path }}&" +
    "oauth_consumer_key%3D" + "{{ customer_key }}" + "%26" +
    "oauth_nonce%3D" + "{{ nonce }}" + "%26" +
    "oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D" + "{{ time }}" + "%26" +
    "{{ optional_token }}" +
    "oauth_version%3D1.0%26" +
    "{{ post_body }}",

  authTemplate : "OAuth " +
    "oauth_nonce=\"" + "{{ nonce }}" + "\", " +
    "oauth_signature_method=\"HMAC-SHA1\", " +
    "oauth_timestamp=\"" + "{{ time }}" + "\", " +
    "oauth_consumer_key=\"" + "{{ customer_key }}" + "\", " +
    "{{ optional_token }}" +
    "oauth_signature=\"" + "{{ signature }}" + "\", " +
    "oauth_version=\"1.0\"",

  constructor : function(config) {
    this.config = config;
    this.consumerSecret = this.config.consumerSecret + "&";

    this.nonce = this._createNonce();
    this.timestamp = (new Date((new Date()).toUTCString())).getTime() / 1000;
  },

  _encode : function (str) {
    return encodeURIComponent(str)
              .replace(/!/g, '%21').replace(/'/g, '%27')
              .replace(/\(/g, '%28').replace(/\)/g, '%29')
              .replace(/\*/g, '%2A');
  },

  _createNonce : function() {
    var nonce = [],
        length = 5; // arbitrary - looks like a good length

    while (length--) {
      nonce.push((((1+Math.random())*0x10000)).toString(16).substring(1));
    }

    return nonce.join("");
  },

  getPostTarget : function() {
    return [ this.path, this.postBody ].join("?");
  },

  setSignature : function(secret) {
    var hmacGen = new jsSHA(this.signatureBaseString, "ASCII");
    this.signature = hmacGen.getHMAC(secret, "ASCII", "SHA-1", "B64") + "%3D";
  },

  setupBaseString : function(token) {
    var tokenReplacement = token ? "oauth_token%3D" + token + "%26" : "";

    this.signatureBaseString = this.sigBaseTemplate
            .split("{{ path }}").join(encodeURIComponent(this.path))
            .split("{{ customer_key }}").join(this.config.customerKey)
            .split("{{ optional_token }}").join(tokenReplacement)
            .split("{{ nonce }}").join(this.nonce)
            .split("{{ time }}").join(this.timestamp)
            .split("{{ post_body }}").join(encodeURIComponent(this.postBody));
  },

  setupAuthHeader : function(token) {
    var tokenReplacement = token ? 'oauth_token="' + token + '", ' : '';

    this.authHeader = this.authTemplate
            .split("{{ nonce }}").join(this.nonce)
            .split("{{ customer_key }}").join(this.config.customerKey)
            .split("{{ optional_token }}").join(tokenReplacement)
            .split("{{ time }}").join(this.timestamp)
            .split("{{ signature }}").join(this.signature);

  },

  getAuthHeader : function() {
    return { 'Authorization' : this.authHeader };
  },

  setupAuthPost : function(user, pw) {
    this.path = "https://api.twitter.com/oauth/access_token";
    this.postBody = "x_auth_mode=client_auth&" +
                    "x_auth_password=" + this._encode(pw) + "&" +
                    "x_auth_username=" + this._encode(user);

    this.setupBaseString();
    this.setSignature(this.consumerSecret);
    this.setupAuthHeader();

    return true;
  },

  setupUpdate : function(status) {
    this.path = "https://api.twitter.com/1/statuses/update.json";
    this.postBody = "status=" + this._encode(status);

    if (!this.token || !this.tokenSecret) {
      return false;
    }

    this.setupBaseString(this.token);
    this.setSignature(this.consumerSecret + this.tokenSecret);
    this.setupAuthHeader(this.token);

    return true;
  },

  setAuth : function(auth) {
    this.token = auth.oauth_token;
    this.tokenSecret = auth.oauth_token_secret;
  }
});

//>>excludeStart('production', kwArgs.releaseName === 'production');
(function(){
  if (window.device && window.device.phonegap) { return; }
  if (!toura.features.socialInBrowser) { return; }

  var key = toura.app.Config.get('app').twitter_anywhere_key;

  if (!key) { return; }

  // this lets us use the Twitter @Anywhere API on desktop
  var s = document.createElement('script');

  // twitter anywhere url & params
  var authUrl = '//platform.twitter.com/anywhere.js?' +

    dojo.objectToQuery({
      id : key,
      v : 1
    });

  // embed script
  s.src = document.location.protocol + authUrl;
  s.async = true;

  document.body.appendChild(s);
}());
//>>excludeEnd('production');
