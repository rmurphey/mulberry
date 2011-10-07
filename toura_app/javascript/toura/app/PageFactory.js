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
dojo.require('toura.pageControllers.node.GridView');
dojo.require('toura.pageControllers.node.Home2');
dojo.require('toura.pageControllers.node.Images1');
dojo.require('toura.pageControllers.node.Images2');
dojo.require('toura.pageControllers.node.StaticMapImages1');
dojo.require('toura.pageControllers.node.Videos1');
dojo.require('toura.pageControllers.node.GridView');
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
    'Feed'              : 'FeedList'
  },

  /**
   * Provide a way to override controller names based on device info.
   */
  _overrides : {
    'FeedList' : function(device) {
      return device.type === 'tablet' ? 'FeedListTablet' : 'FeedListPhone';
    },

    'Home1' : function(device) {
      return device.type === 'tablet' ? 'Home1Tablet' : 'Home1Phone';
    }
  },

  pages : {
    "node" : function(node) {
      if (!node) {
        throw new Error('toura.app.PageFactory::pages::node requires a node');
      }

      var controllerName = node.pageController || 'Default',
          config, Controller;

      // allow setting different page controllers per device
      if (node.pageController && dojo.isObject(node.pageController)) {
        controllerName = node.pageController[this.device.type] || 'Default';
      } else {
        controllerName = node.pageController || 'Default';
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
        baseObj : node,
        device : this.device,
        templateConfig : config
      });
    },

    "search" : function() {
      return new toura.pageControllers.search.Search({ device : this.device });
    },

    "favorites" : function() {
      return new toura.pageControllers.favorites.Favorites({ device : this.device });
    },

    "feedItem" : function(feedItem) {
      var Controller = toura.pageControllers.Configurable,
          templateConfig = toura.templates.FeedItem;

      return new Controller({
        baseObj : feedItem,
        device : this.device,
        templateConfig : templateConfig
      });
    },

    "debug" : function(query) {
      return new toura.pageControllers.Debug({ device : this.device, query : query });
    }
  },

  createPage : function(type, obj) {
    if (!type) {
      throw new Error('toura.app.PageFactory::createPage must be called with a type');
    }

    if (!this.pages[type]) {
      throw new Error('toura.app.PageFactory::createPage: No handler for type ' + type);
    }

    return this.pages[type].apply(this, [ obj ]);
  }

});

dojo.subscribe('/app/ready', function() {
  toura.app.PageFactory = new toura.app.PageFactory(toura.app.Config.get('device'));
});
