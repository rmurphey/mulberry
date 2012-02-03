dojo.provide('mulberry.containers.Page');

dojo.require('mulberry._View');
dojo.require('mulberry.ui.BackgroundImage');
dojo.require('mulberry.containers.Screen');
dojo.require('mulberry.components._base');
dojo.require('mulberry.capabilities._base');

dojo.declare('mulberry.containers.Page', [ mulberry._View, mulberry.ui.BackgroundImage ], {
  pageDef : {},
  templateString : dojo.cache('mulberry.containers', 'Page/Page.haml'),

  postMixInProperties : function() {
    this.inherited(arguments);
    this.baseObj.shareable = this.baseObj.type === 'node';
  },

  postCreate : function() {
    this.screens = {};

    if (!this.baseObj) {
      throw "mulberry.Page requires a base object";
    }

    if (!this.pageDef.screens || !this.pageDef.screens.length) {
      throw "The config for mulberry.Page must have at least one screen defined";
    }

    var bgImg = this.baseObj.pageBackground;

    dojo.forEach(this.pageDef.screens, function(screen) {
      var scr = this.adopt(mulberry.containers.Screen, {
        page : this,
        config : screen,
        baseObj : this.baseObj,
        device : this.device,
        backgroundImage : bgImg
      }).placeAt(this.domNode);

      this.screens[screen.name] = scr;
    }, this);

    this.capabilities = dojo.map(this.pageDef.capabilities || [], function(config) {
      var C = dojo.isObject(config) ? config.name : config,
          components = config.components;

      if (!mulberry.capabilities[C]) {
        console.warn('No capability', C, 'defined -- did you remember to require it in mulberry.capabilities._base?');
        return null;
      }

      return new mulberry.capabilities[C]({
        page : this,
        baseObj : this.baseObj,
        components : components
      });
    }, this);

    if (this.screens.detail) {
      this.screens.detail.hide();
    }

    this.addClass('page-' + this.baseObj.id);
    this.addClass(this.pageDefName);
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

  init : function() {
    // for capability connections
  }
});
