dojo.provide('toura.Page');

dojo.require('toura.pageControllers._Page');
dojo.require('toura.containers.Screen');
dojo.require('toura.components._base');
dojo.require('toura.capabilities._base');

dojo.declare('toura.Page', toura.pageControllers._Page, {
  templateConfig : {},
  templateString : dojo.cache('toura', 'Page/Page.haml'),

  postMixInProperties : function() {
    this.inherited(arguments);
    this.baseObj.shareable = this.baseObj.type === 'node';
  },

  postCreate : function() {
    this.inherited(arguments);
    this.screens = {};

    if (!this.baseObj) {
      throw "toura.Page requires a base object";
    }

    if (!this.templateConfig.screens || !this.templateConfig.screens.length) {
      throw "The config for toura.Page must have at least one screen defined";
    }

    dojo.forEach(this.templateConfig.screens, function(screen) {
      var scr = this.adopt(toura.containers.Screen, {
        page : this,
        config : screen,
        baseObj : this.baseObj,
        device : this.device,
        backgroundImage : this._getBackgroundImage()
      }).placeAt(this.domNode);

      this.screens[screen.name] = scr;
    }, this);

    this.capabilities = dojo.map(this.templateConfig.capabilities || [], function(config) {
      var C = dojo.isObject(config) ? config.name : config,
          components = config.components;

      if (!toura.capabilities[C]) {
        console.warn('No capability', C, 'defined -- did you remember to require it in toura.capabilities._base?');
        return null;
      }

      return new toura.capabilities[C]({
        page : this,
        baseObj : this.baseObj,
        components : components
      });
    }, this);

    if (this.screens.detail) {
      this.screens.detail.hide();
    }

    this.addClass('page-' + this.baseObj.id);
    this.addClass(this.templateName);
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

  getComponent : function(componentName) {
    var c = false;

    this._components = this._components || {};

    if (!this._components[componentName]) {
      dojo.forIn(this.screens, function(screenName, screen) {
        var tmp = screen.getComponent(componentName);
        if (tmp) { c = tmp; }
      });

      this._components[componentName] = c;
    }

    return this._components[componentName];
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

