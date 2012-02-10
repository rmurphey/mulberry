dojo.provide('mulberry.app.UI');

dojo.require('mulberry.Device');
dojo.require('mulberry.Utilities');
dojo.require('mulberry.app.Config');
dojo.require('mulberry.containers.Viewport');
dojo.require('toura.components.SiblingNav');
dojo.require('mulberry.app.PhoneGap');
dojo.require('dojo.string');

dojo.require('dojo.Stateful');

dojo.declare('mulberry.app.UI', dojo.Stateful, {
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

    this._adSetup();
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
        mulberry.app.DeviceStorage.set('fontSize', newSize);
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
    dojo.addClass(b, 'version-' + mulberry.app.PhoneGap.device.version);

    this.set('fontSize', mulberry.app.DeviceStorage.get('fontSize'));

    if (mulberry.features.multiLineChildNodes) {
      dojo.addClass(b, 'multi-line-child-nodes');
    }

    if (mulberry.isMAP) {
      dojo.addClass(b, 'layout-MAP');
    }

    dojo.forIn(mulberry.features, function(feature, enabled) {
      if (enabled) {
        dojo.addClass(b, 'feature-' + feature);
      }
    });
  },

  _containersSetup : function() {
    this.containers.viewport = new mulberry.containers.Viewport().placeAt(this.body, 'first');
  },

  _navSetup : function() {
    if (!mulberry.features.siblingNav) { return; }
    this.siblingNav = new toura.components.SiblingNav().placeAt(this.body, 'last');
    this.set('siblingNavVisible', false);
  },

  _adSetup : function() {
    if (!mulberry.features.ads) { return; }
    mulberry.app.PhoneGap.network.isReachable()
      .then(
        dojo.hitch(this, function(isReachable) {
          if (!isReachable) { return; }
          new toura.components.AdTag().placeAt(this.body, 'last');
      })
    );
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
      mulberry.app.Router.back();
    });

    dojo.connect(document, 'searchbutton', this, function(e) {
      mulberry.app.Router.go('/search');
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
      throw new Error('mulberry.app.UI::showPage called without a page to show');
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
  mulberry.app.UI = new mulberry.app.UI(mulberry.Device);
  mulberry.showPage = dojo.hitch(mulberry.app.UI, 'showPage');
});
