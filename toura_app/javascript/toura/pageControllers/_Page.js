dojo.provide('toura.pageControllers._Page');

dojo.require('toura._View');
dojo.require('toura.ui.BackgroundImage');

dojo.declare('toura.pageControllers._Page', [ toura._View, toura.ui.BackgroundImage ], {
  widgetsInTemplate : true,

  init : function(pageState) {
    // stub for subclasses
    this.initialized = true;
  },

  postMixInProperties : function() {
    this.inherited(arguments);

    if (!this.device) {
      throw 'No device defined for page controller';
    }
  },

  postCreate : function() {
    this.setupNav();

    this._doPlacements();
    this._setup();
    this._applyBackgroundImage();

    this.inherited(arguments);
  },

  _doPlacements : function() {
    this.componentStartups = [];

    dojo.forEach(this.placements || [], function(arr) {
      if (arr.length < 3) {
        console.error('Not enough information for placement', arr);
        return;
      }

      var target = this[arr[2]],
          data = arr[1],
          C = toura.components[arr[0]],
          component,
          position = arr[3] || 'last';

      if (target && C) {
        component = this.adopt(C, data);
        this[arr[2]] = component.placeAt(target, position);
        if (component.startup) {
          this.componentStartups.push(dojo.hitch(component, 'startup'));
        }
      }
    }, this);
  },

  // stub for implementation
  _setup : function() {},

  _applyBackgroundImage : function() {
    var img = this._getBackgroundImage();
    if (!img) { return; }

    this.set('backgroundImage', img);
    this.set('resizeMethod', 'cover');
    this.loadImage();
  },

  _getBackgroundImage : function() {
    var appBgImg = toura.app.Config.get('app').backgroundImage,
        img;

    if (!appBgImg) {
      console.warn('toura.pageControllers._Page::_getBackgroundImage: No bg image specified for app.');
      return;
    }

    appBgImg = appBgImg[this.device.type];

    if (!appBgImg) {
      console.warn('toura.pageControllers._Page::_getBackgroundImage: No bg image specified for type.');
      return;
    }

    img = toura.app.Data.getModel(appBgImg, 'backgroundImage');

    return this.device.type === 'phone' ? img.gallery : img.original;
  },

  _getDimensions : function() {
    return toura.app.UI.viewport;
  },

  // stub. Should be implemented by subclasses
  setupNav : function() {},

  startup : function() {
    this.inherited(arguments);

    dojo.forEach(this.componentStartups, function(fn) {
      fn();
    });
  }

});
