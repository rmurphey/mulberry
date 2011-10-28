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
dojo.require('toura.pageControllers.node.Videos1');
dojo.require('toura.pageControllers.Configurable');

dojo.declare('toura.app.PageFactory', [], {
  constructor : function(device) {
    this.device = device;
  },

  _translations : {
    'videos'            : 'Videos1',
    'locations-map'     : 'GoogleMap1'
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

    "feedItem" : function(obj) {
      var Controller = toura.pageControllers.Configurable,
          templateConfig = toura.templates['feed-item'];

      return new Controller({
        baseObj : obj.feedItem,
        device : this.device,
        templateConfig : templateConfig
      });
    },

    "debug" : function(obj) {
      return new toura.pageControllers.Debug({ device : this.device, query : obj.query });
    }
  },

  createPage : function(obj) {
    /*
     * createPage receives an object that it will use to create a page. It
     * looks at the object for a pageController property, and uses that
     * pageController property to determine how to set up the page controller
     * for the page. The process for determining this is a bit convoluted for
     * the time being, in order to support some legacy systems. Here's how it
     * works:
     *
     * First, we determine the name of the controller we're going to use:
     *
     *    1. If the object does not have a pageController property, then the
     *    controllerName is set to 'default'
     *
     *    2. If the object has a pageController property and the property's
     *    value is an object, then it is assumed the object has a 'phone' and
     *    a 'tablet' property; the controllerName is set to the value that
     *    corresponds with the device type.
     *
     * Next, we check the PageFactory's 'pages' object to determine whether the
     * specified controllerName should receive special handling.
     *
     *    1. If there is an entry in the pages object that corresponds with the
     *    controllerName, we expect that entry to point to a function. We call
     *    that function, passing it the object that was passed to createPage,
     *    and return its result. In this case, the createPage method is
     *    complete.
     *
     *    2. If there is not an entry in the pages object that corresponds with
     *    the controllerName, the createPage method continues.
     *
     * Next, we translate "new" controller names into legacy controller names.
     * We do this by inspecting the PageFactory's '_translations' object; if it
     * has an entry that corresponds with the controllerName, we use that
     * entry's value as the new controllerName. (This is necessary for
     * controllers that have not been converted to the new "configurable"
     * system. When all controllers have been converted to the new system, the
     * _translations object can go away.)
     *
     * Finally, we handle the case where MAP (Toura's internal CMS) is using
     * old controller names (such as Home1, Images1, etc.). We do this by
     * inspecting the PageFactory's '_overrides' object; if it has an entry
     * that corresponds with the controllerName, we assume that entry points to
     * a function. We run the function, passing the device object as an
     * argument, and use the return value as the new controllerName.
     *
     * At this point, we have a reliable controllerName. We look to see if
     * there is an entry in the toura.templates object for the controllerName.
     * If there is, we use the Configurable page controller; if not, we look
     * for a legacy page controller with that name. (This is necessary until
     * all *node* page controllers have been converted to the new system.)
     *
     * Once we have determined the proper page controller to use, we create an
     * instance of that controller, passing it the data it will need in order
     * to create the page. We return the controller instance, and createPage is
     * complete.
     */

    if (!obj) { throw new Error('toura.app.PageFactory::createPage requires an object'); }

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
    // TODO: this can go away once we don't have to support legacy names
    if (this._translations[controllerName]) {
      controllerName = this._translations[controllerName];
    }

    // allow overriding template name based on device info
    // TODO: this can go away once MAP sends per-device controller names
    if (this._overrides[controllerName]) {
      controllerName = this._overrides[controllerName](this.device);
    }

    // use configurable page controller if a config is defined for the
    // controller name; otherwise look for a legacy page controller
    // TODO: this can go away once we eliminate support for legacy names
    config = toura.templates && toura.templates[controllerName];

    Controller = config ? toura.pageControllers.Configurable : toura.pageControllers.node[controllerName];

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
