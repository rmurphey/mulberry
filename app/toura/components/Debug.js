dojo.provide('toura.components.Debug');

dojo.require('toura._Component');

dojo.declare('toura.components.Debug', toura._Component, {
  templateString : dojo.cache('toura.components', 'Debug/Debug.haml'),

  prepareData : function() {
    var html = [],
        tpl = function(k, v) {
          return '<tr><th>{k}</th><td>{v}</td></tr>'.replace('{k}', k).replace('{v}', v);
        },
        header = function(t) {
          return '<tr><th colspan=2>' + t + '</th></tr>';
        },
        k;

    html.push(header('Device'));

    if (window.device) {
      dojo.forIn(window.device, function(k, v) {
        html.push(tpl(k, v));
      });
    }

    html.push(tpl('UA', window.navigator.userAgent));
    html.push(tpl('Device Type', this.device.type));
    html.push(tpl('Device OS', this.device.os));

    var app = toura.app.Config.get('app');

    html.push(header('App'));
    html.push(tpl('Build Date', toura.app.Config.get('buildDate')));
    html.push(tpl('Data Version', toura.app.Tour._getLocalVersion()));

    dojo.forIn(app, function(k, v) {
      html.push(tpl(k, v));
    });

    html.push(header('Features'));

    dojo.forIn(toura.features, function(k, v) {
      html.push(tpl(k, v ? 'true' : 'false'));
    });

    this.info = html.join('');
    this.inherited(arguments);
  },

  postCreate : function() {
    this.inherited(arguments);
    this.deviceInfo.innerHTML = this.info;
  },

  _weinre : function() {
    this.status.innerHTML = 'debugging at ' + toura.app._Debug.weinre.init();
    dojo.publish('/content/update');
  },

  _resetDB : function() {
    toura.app.DeviceStorage.drop();
    window.location.reload();
  }
});

