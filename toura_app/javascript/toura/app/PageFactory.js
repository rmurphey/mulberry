dojo.provide('toura.app.PageFactory');

dojo.require('toura.app.Config');

/**
 * TODO: create a single file that requires all page controllers
 * and then require it here.
 */
dojo.require('toura.pageControllers.Debug');

dojo.require('toura.pageControllers.search.Search');
dojo.require('toura.pageControllers.favorites.Favorites');
dojo.require('toura.pageControllers.node.Audios1');
dojo.require('toura.pageControllers.node.GoogleMap1');
dojo.require('toura.pageControllers.node.Images2');
dojo.require('toura.pageControllers.node.Videos1');
dojo.require('toura.pageControllers.Configurable');

dojo.declare('toura.app.PageFactory', [], {
  constructor : function(device) {
    this.device = device;
  },

  _translations : {
    'Home'              : 'Home1',
    'Audios'            : 'Audios1',
    'Videos'            : 'Videos1',
    'Images'            : 'Images1',
    'FullScreenImages'  : 'Images2',
    'LocationsMap'      : 'GoogleMap1',
    'Feed'              : 'FeedList',
    'Default'           : 'default',
    'FeedItem'          : 'feed-item',
    'NodeGallery'       : 'node-gallery',
    'LocationList'      : 'location-list',
    'Hotspots'          : 'hotspots',
    'GridView'          : 'grid-view'
  },

  /**
   * Provide a way to override controller names based on device info.
   */
  _overrides : {
    'FeedList' : function(device) {
      return 'feed-list-' + device.type;
    },

    'Images1' : function(device) {
      return 'images-and-text-' + device.type;
    },

    'Home1' : function(device) {
      return 'home-' + device.type;
    },

    'Home2' : function(device) {
      return 'home-with-header-' + device.type;
    },

    'Audios1' : function(device) {
      return 'audio-with-images-' + device.type;
    }
  },

  pages : {
    "search" : function() {
      return new toura.pageControllers.search.Search({ device : this.device });
    },

    "favorites" : function() {
      return new toura.pageControllers.favorites.Favorites({ device : this.device });
    },

    "feedItem" : function(feedItem) {
      var Controller = toura.pageControllers.Configurable,
          templateConfig = toura.templates['feed-item'];

      return new Controller({
        baseObj : feedItem,
        device : this.device,
        templateConfig : templateConfig
      });
    },

    "debug" : function(obj) {
      return new toura.pageControllers.Debug({ device : this.device, query : obj.query });
    }
  },

  createPage : function(obj) {
    if (!obj) {
      throw new Error('toura.app.PageFactory::createPage requires an object');
    }

    var controllerName = obj.pageController || 'default',
        config, Controller;

    // allow setting different page controllers per device
    if (obj.pageController && dojo.isObject(obj.pageController)) {
      controllerName = obj.pageController[this.device.type] || 'default';
    } else {
      controllerName = obj.pageController || 'default';
    }

    // handle special cases like search, favorites, feed item, debug
    // TODO: this can go away once those pages are converted to configurables
    if (this.pages[controllerName]) {
      return this.pages[controllerName].call(this, obj);
    }

    // translate new template names to legacy names
    if (this._translations[controllerName]) {
      controllerName = this._translations[controllerName];
    }

    // allow overriding template name based on device info
    if (this._overrides[controllerName]) {
      controllerName = this._overrides[controllerName](this.device);
    }

    // use configurable page controller if a config is defined for the
    // controller name; otherwise look for a legacy page controller
    config = toura.templates && toura.templates[controllerName];

    if (config) {
      Controller = toura.pageControllers.Configurable;
      console.log('using configurable controller');
    } else {
      Controller = toura.pageControllers.node[controllerName];
    }

    // if we don't have a controller by now, we have problems
    if (!Controller) {
      console.error('toura.app.PageFactory: The controller "' + controllerName + '" does not exist. Did you require it in PageFactory?');
      throw('toura.app.PageFactory: The controller "' + controllerName + '" does not exist. Did you require it in PageFactory?');
    }

    toura.log('Creating ' + controllerName);

    return new Controller({
      baseObj : obj,
      device : this.device,
      templateConfig : config,
      templateName : controllerName
    });
  }
});

dojo.subscribe('/app/ready', function() {
  toura.app.PageFactory = new toura.app.PageFactory(toura.app.Config.get('device'));
});
