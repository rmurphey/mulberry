dojo.provide('toura.pageControllers.Configurable');

dojo.require('toura.pageControllers._Page');
dojo.require('toura.containers.Screen');
dojo.require('toura.components._base');
dojo.require('toura.capabilities._base');

dojo.declare('toura.pageControllers.Configurable', [ toura.pageControllers._Page ], {
  templateConfig : {},
  templateString : dojo.cache('toura.pageControllers', 'Configurable/Configurable.haml'),

  screens : {},

  postMixInProperties : function() {
    this.inherited(arguments);
    console.log('BASE OBJ', this.baseObj);
    this.baseObj.shareable = this.baseObj.type === 'node';
    console.log('TEMPLATE CONFIG', this.templateConfig);
  },

  postCreate : function() {
    this.inherited(arguments);

    if (!this.baseObj) {
      throw "Configurable page controller requires a base object";
    }

    if (!this.templateConfig) {
      throw "Configurable page controller requires a template config";
    }

    if (!this.templateConfig.screens || !this.templateConfig.screens.length) {
      throw "Configurable page controller must have at least one screen defined";
    }

    dojo.forEach(this.templateConfig.screens, function(screen) {
      var scr = this.adopt(toura.containers.Screen, {
        config : screen,
        baseObj : this.baseObj,
        device : this.device,
        backgroundImage : this._getBackgroundImage()
      }).placeAt(this.domNode);

      this.screens[screen.name] = scr;
    }, this);

    this.capabilities = dojo.map(this.templateConfig.capabilities || [], function(config) {
      var C = config.name,
          components = config.components;

      if (!toura.capabilities[C]) {
        console.warn('No capability', C, 'defined -- did you remember to require it in toura.capabilities._base?');
        return null;
      }

      return new toura.capabilities[C]({ page : this, components : components });
    }, this);

    if (this.screens.detail) {
      this.screens.detail.hide();
    }

    this.addClass('page-' + this.baseObj.id);
  },

  showScreen : function (screenName) {
    dojo.forIn(this.screens, function(name, screen) {
      if (name !== screenName) {
        screen.hide();
      }
    });
    this.screens[screenName].show();
  },

  getScreen : function(screenName) {
    return this.screens[screenName];
  },

  startup : function() {
    this.inherited(arguments);
    dojo.forIn(this.screens, function(name, screen) {
      screen.startup();
    });
  },

  /**
   * @override
   */
  _applyBackgroundImage : function() { },

  _getBackgroundImage : function() {
    var img;

    if (this.baseObj.getBackgroundImage) {
      img = this.baseObj.getBackgroundImage(this.device);
    }

    return img || this.inherited(arguments);
  }
});

