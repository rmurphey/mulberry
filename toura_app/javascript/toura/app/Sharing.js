dojo.provide('toura.app.Sharing');

dojo.require('toura.app.user.Facebook.base');
dojo.require('toura.app.user.Twitter');
dojo.require('dojo.string');

dojo.requireLocalization('toura', 'toura');

toura.app.Sharing = {
  lastPost : {},

  getMessage : function(svc, obj) {
    console.log('toura.app.Sharing::getMessage', arguments);

    var app = toura.app.Config.get('app'),
        defaultTmpl = app.sharingText || toura.sharingText || "${sharingURL}",
        consumed = 0,
        ret;

    // allow for case where no object is passed
    obj = obj || { "name" : app.name };

    // use default sharing url if one isn't present on the object
    console.log('app sharing URL is ' + app.sharingUrl);
    obj.sharingURL = obj.sharingURL || app.sharingUrl || toura.sharingURL;

    if (!obj.sharingURL) {
      console.error('No sharing URL defined for object or app. This will end badly.');
    }

    if (!defaultTmpl) {
      console.error('No sharing text template defined. This will end badly.');
    }

    if (svc === 'twitter') {
      // account for the sharing url
      consumed += obj.sharingURL.length;

      // truncate the part that comes before the sharing URL
      ret = dojo.string.substitute(defaultTmpl, obj).split(obj.sharingURL);

      // acount for anything after the sharing URL
      if (ret[1]) { consumed += ret[1].length; }

      // reassemble the message
      ret = [
        dojo.trim(ret[0].substr(0, 140 - consumed)),
        obj.sharingURL,
        ret[1] || ''
      ].join(' ');
    } else {
      // yay services that don't require short messages
      ret = dojo.string.substitute(defaultTmpl, obj) + ' ' + obj.sharingURL;
    }

    return ret;
  },

  share : function(service, params, node) {
    console.log('toura.app.Sharing::share()');

    var dfd = new dojo.Deferred(),
        svc = service.name,
        doit = true,
        before = service.beforePost ? !!service.beforePost(params) : true;

    if (before !== true) {
      console.log('beforePost was not true');
      dfd.reject(service.beforePostError);
      doit = false;
    }

    if (this.lastPost[svc] && (this.lastPost[svc] === params.msg)) {
      dfd.reject('The message is a duplicate.');
      doit = false;
    }

    if (doit) {
      console.log('doing it');

      service.api.postMessage(params.msg)
        .then(dojo.hitch(this, function() {
          this.lastPost[svc] = params.msg;
          dojo.publish('/share', [
            [ svc, node.id, params.msg ].join(': ')
          ]);
          dfd.resolve();
        }));
    }

    return dfd.promise;
  },

  getServices : function() {
    var i18n = dojo.i18n.getLocalization('toura', 'toura', toura.app.Config.get('locale')),
        services = [];

    if (!toura.app.user.Twitter.disabled) {
      services.push({
        name : 'twitter',
        api : toura.app.user.Twitter,
        requireAuth : !toura.app.user.Twitter.isAuthenticated(),
        maxLength : 140,
        beforePost : function(params) {
          return !!toura.app.user.Twitter.setUserInfo(params);
        },
        beforePostError : i18n.TWITTER_AUTHENTICATION_ERROR
      });
    }

    if (!toura.app.user.Facebook.disabled) {
      services.push({
        name : 'facebook',
        api : toura.app.user.Facebook
      });
    }

    return services;
  }
};

dojo.subscribe('/app/ready', function() {
  toura.app.user.Facebook = new toura.app.user.Facebook.base();
  toura.app.user.Twitter = new toura.app.user.Twitter();
});
