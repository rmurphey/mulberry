dojo.provide('toura.app.PhoneGap.device');

(function() {

  function parseVersion(ua) {
    if (!ua) {
      return 'unknown';
    }

    if (!dojo.isString(ua)) {
      return 'unknown';
    }

    if (!dojo.trim(ua)) {
      return 'unknown';
    }

    var v;

    if (ua.match('Android')) {
      v = dojo.trim(
            ua.split('Android')[1].split(';')[0]
          ).split('-')[0].split('.');

      return assembleVersion(v);
    }

    if (ua.indexOf('AppleWebKit') > -1 &&
      (ua.indexOf('iPhone') + ua.indexOf('iPad') + ua.indexOf('iPod')) >= 0
    ) {
      // let's cross this bridge another day
      return 'unknown-ios-webkit';
    }

    // SOL
    return 'unknown';
  }

  function assembleVersion(version) {
    return [ version[0], version[1] || '0' ].join('-');
  }

  toura.app.PhoneGap.device = function(pg, device) {
    return {
      version : (function() {
        // http://www.zytrax.com/tech/web/mobile_ids.html
        if (pg) {
          return assembleVersion(window.device.version.split('-')[0].split('.'));
        }

        return parseVersion(window.navigator.userAgent);
      }()),

      _parseVersion : parseVersion
    };
  };

}());
