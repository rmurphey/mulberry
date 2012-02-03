dojo.provide('mulberry.app.Sharing');

dojo.require('mulberry.app.user.Facebook.base');
dojo.require('mulberry.app.user.Twitter');
dojo.require('dojo.string');

dojo.requireLocalization('mulberry', 'mulberry');

mulberry.app.Sharing = {
  lastPost : {},

  getMessage : function(svc, obj) {
    console.log('mulberry.app.Sharing::getMessage', arguments);

    var app = mulberry.app.Config.get('app'),
        defaultTmpl = app.sharingText || mulberry.sharingText || "${sharingURL}",
        consumed = 0,
        ret;

    // allow for case where no object is passed
    obj = obj || { "name" : app.name };

    // use default sharing url if one isn't present on the object
    console.log('app sharing URL is ' + app.sharingUrl);
    obj.sharingURL = obj.sharingURL || app.sharingUrl || mulberry.sharingURL;

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
    console.log('mulberry.app.Sharing::share()');

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
    var i18n = dojo.i18n.getLocalization('mulberry', 'mulberry', mulberry.app.Config.get('locale')),
        services = [];

    if (!mulberry.app.user.Twitter.disabled) {
      services.push({
        name : 'twitter',
        api : mulberry.app.user.Twitter,
        requireAuth : !mulberry.app.user.Twitter.isAuthenticated(),
        maxLength : 140,
        beforePost : function(params) {
          return !!mulberry.app.user.Twitter.setUserInfo(params);
        },
        beforePostError : i18n.TWITTER_AUTHENTICATION_ERROR
      });
    }

    if (!mulberry.app.user.Facebook.disabled) {
      services.push({
        name : 'facebook',
        api : mulberry.app.user.Facebook
      });
    }

    return services;
  }
};

dojo.subscribe('/app/ready', function() {
  mulberry.app.user.Facebook = new mulberry.app.user.Facebook.base();
  mulberry.app.user.Twitter = new mulberry.app.user.Twitter();
});
