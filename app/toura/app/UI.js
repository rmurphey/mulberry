dojo.provide('toura.app.UI');

dojo.require('toura.Utilities');
dojo.require('toura.app.Config');
dojo.require('toura.containers.Viewport');
dojo.require('toura.components.SiblingNav');
dojo.require('toura.app.PhoneGap');
dojo.require('dojo.string');

dojo.require('dojo.Stateful');

dojo.declare('toura.app.UI', [ dojo.Stateful ], {
  containers : {},
  currentPage : null,

  constructor : function(device) {
    this.device = device;
    this.body = dojo.body();
    this.hasTouch = 'ontouchstart' in window;
    this.touchMoveDebounce = device.os === 'android' ? 200 : 0;

    this._navSetup();
    this._watchers();
    this._updateViewport();

    this._uiSetup();
    this._eventSetup();
    this._containersSetup();
  },

  _watchers : function() {
    var watchers = {
      fontSize : function(k, oldSize, newSize) {
        var b = this.body;
        if (oldSize) { dojo.removeClass(b, oldSize); }
        dojo.addClass(b, newSize);
        toura.app.DeviceStorage.set('fontSize', newSize);
        dojo.publish('/fontsize');
      },

      navDirection : function(k, old, dir) {
        this.containers.viewport.set('navDirection', dir);
      },

      siblingNavVisible : function(k, old, visible) {
        if (!this.siblingNav) { return; }

        if (!this.siblingNav.siblings) {
          this.siblingNav.hide();
          return;
        }

        this.siblingNav[ visible ? 'show' : 'hide' ]();
      }
    };

    dojo.forIn(watchers, this.watch, this);
  },

  _updateViewport : function() {
    this.viewport = {
      width : this.body.offsetWidth,
      height : this.body.offsetHeight
    };
  },

  _uiSetup : function() {
    var b = this.body,
        device = this.device,
        feature;

    dojo.addClass(b, device.type);
    dojo.addClass(b, device.os);
    dojo.addClass(b, 'version-' + toura.app.PhoneGap.device.version);

    this.set('fontSize', toura.app.DeviceStorage.get('fontSize'));

    if (toura.features.multiLineChildNodes) {
      dojo.addClass(b, 'multi-line-child-nodes');
    }

    if (toura.isMAP) {
      dojo.addClass(b, 'layout-MAP');
    }

    dojo.forIn(toura.features, function(feature, enabled) {
      if (enabled) {
        dojo.addClass(b, 'feature-' + feature);
      }
    });
  },

  _containersSetup : function() {
    this.containers.viewport = new toura.containers.Viewport().placeAt(this.body, 'first');
  },

  _navSetup : function() {
    if (!toura.features.siblingNav) { return; }
    this.siblingNav = new toura.components.SiblingNav().placeAt(this.body, 'last');
    this.set('siblingNavVisible', false);
  },

  _eventSetup : function() {
    dojo.connect(document, 'touchmove', function(e) {
      e.preventDefault();
    });

    dojo.connect(window, 'resize', this, function() {
      this._updateViewport();
      dojo.publish('/window/resize');
    });

    dojo.connect(document, 'menubutton', this, function(e) {
      e.preventDefault();
      dojo.publish('/button/menu');
    });

    dojo.connect(document, 'backbutton', this, function(e) {
      e.preventDefault();
      toura.app.Router.back();
    });

    dojo.connect(document, 'searchbutton', this, function(e) {
      toura.app.Router.go('/search');
      e.preventDefault();
    });

    if (this.siblingNav) {
      dojo.connect(this.siblingNav, 'show', this, function() {
        dojo.addClass(this.body, 'sibling-nav-visible');
        dojo.publish('/window/resize');
      });

      dojo.connect(this.siblingNav, 'hide', this, function() {
        dojo.removeClass(this.body, 'sibling-nav-visible');
        dojo.publish('/window/resize');
      });
    }
  },

  showPage : function(page, node) {
    if (!page) {
      throw new Error('toura.app.UI::showPage called without a page to show');
    }

    if (page.startup) {
      var s = dojo.subscribe('/page/transition/end', function() {
        page.startup();
        dojo.unsubscribe(s);
      });
    }

    this.containers.viewport.set('content', page);
    this.currentPage = page;

    if (!this.siblingNav) { return; }
    this.set('siblingNavVisible', true);
    this.siblingNav.set('node', node);
  },

  hideSplash : function() {
    var splash = dojo.byId('splash');
    if (splash) { dojo.destroy(splash); }
  }
});

dojo.subscribe('/app/ready', function() {
  toura.app.UI = new toura.app.UI(toura.app.Config.get('device'));
  toura.showPage = dojo.hitch(toura.app.UI, 'showPage');
});
