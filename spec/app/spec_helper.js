require('/dojo-release-1.6.0-src/dojo/dojo.js');
require('/vendor/haml.js');
require('/fixtures/tour.js');
require('/toura/_Logging.js');

var dataAPI,
    nodeForController,
    isWidgetRegistered,
    getRootSelector,
    getEventHandlers,
    pageControllerMocks,
    routerMock,
    allDevices,

    fakeEventObj = {
      preventDefault : function() {},
      stopPropagation : function() {}
    },

    devices = [
      { os : 'ios', type : 'phone' },
      { os : 'ios', type : 'tablet' },
      { os : 'android', type : 'phone' }
    ];

toura = {};
toura.data = {};
toura.features = toura.features || {};

// this might need to be removed in dojo 1.7
delete window.require;
window.require = undefined;

beforeEach(function() {
  dojo.registerModulePath('toura', '../../toura');
  dojo.registerModulePath('vendor', '../../vendor');
  dojo.registerModulePath('data', '../../data-fixtures');
  dojo.registerModulePath('fixtures', '../../fixtures');

  dojo.require('toura._Config');
  dojo.require('toura.Utilities');
  dojo.require('toura.app.Data');
  dojo.require('toura.app.Config');
  dojo.require('dojo.cache');
  dojo.require('toura.app.Has');

  toura = toura || {};
  toura.app = toura.app || {};

  toura.app.UI = toura.app.UI || {
    hasTouch : true,
    set : function() { }
  };

  toura.app.Config.set('app', toura.data.local.app);

  toura.app.Has = dojo.isFunction(toura.app.Has) ? toura.app.Has() : toura.app.Has;
  dataAPI = toura.app.Data = dataAPI || new toura.app.Data(toura.data.local.items);

  nodeForController = function(c) {
    var node,
        map = {
        'Images1'       : 'node-image_gallery',
        'Videos1'       : 'node-videos',
        'Audios1'       : 'node-audio_list',
        'GoogleMap1'    : 'node-location_map',
        'FeedList'      : 'node-feed_list',
        'LocationList'  : 'node-locations',
        'Default'       : 'node-about'
      };

    if (map[c]) {
      node = dataAPI.getModel(map[c]);
    }

    return node;
  };

  isWidgetRegistered = function(widgetName) {
    var w, widgets = [];

    for (w in dijit.registry._hash) {
      if (dijit.registry._hash.hasOwnProperty(w)) {
        widgets.push(w);
      }
    }

    return dojo.some(widgets, function(widget) {
      return widget.match(widgetName);
    });
  };

  getRootSelector = function(instance) {
    if (!instance.templateString) {
      console.error('no template string for', instance);
    }

    return instance.templateString ? dojo.trim(
      instance.templateString
        .split('\n')[0]
        .split('{')[0]
        .split('=')[0]
        .replace('%','')
    ) : 'undefined';
  };

  getEventHandlers = function(instance, evt, el) {
    var matches = dojo.filter(instance._connects, function(c) {
      c = c[0];
      return c[1] === evt && (el ? c[0] === el : true);
    });

    return dojo.map(matches, function(c) {
      return c[0][2];
    });
  };

  getEventHandler = function(instance, evt, el) {
    var matches = getEventHandlers(instance, evt, el);
    return matches.length ? matches[0] : false;
  };

  pageControllerMocks = function() {
    toura.app.user = toura.app.user || {};
    toura.app.user.Facebook = toura.app.user.Twitter = {
      isAuthenticated : function() {
        return true;
      }
    };

    toura.app.user.Favorites = {
      isFavorite : function() {
        return true;
      },
      hasFavorites : function() {
        return true;
      }
    };

    toura.app.UI = {
      supportsCssBackgroundContain : function() { return true; },
      viewport : {
        width : 100,
        height : 100
      },
      set : function() { }
    };
  };

  routerMock = function() {
    toura.app.Router = toura.app.Router || {
      go : function() {},
      back : function() {},
      home : function() {}
    };
  };

  makeMockNodes = function(amount, mixinProps) {
    var nodes = [];
    while(amount--) {
      nodes.push({});
    }

    if (mixinProps) {
      nodes = dojo.map(nodes, function(node) {
        return dojo.mixin(node, mixinProps);
      });
    }

    return nodes;
  };

  allDevices = function(cb) {
    dojo.forEach(devices, function(d) {
      toura.Device = d;
      toura.app.Config.set('device', d);
      cb(d);
    });
  };
});
