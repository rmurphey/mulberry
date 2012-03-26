dojo.provide('toura.UI');

dojo.require('dojo.Stateful');

dojo.require('toura.components.SiblingNav');
dojo.require('toura.components.AdTag');

(function(m) {

var adsClass = 'has-ads',
    siblingNavClass = 'sibling-nav-visible';

dojo.declare('toura.UI', dojo.Stateful, {
  constructor : function() {
    this.body = dojo.body();
    this.appConfig = mulberry.app.Config.get('app');

    this._setupFeatureClasses();
    this._setupSiblingNav();

    dojo.connect(m.app.UI, 'showPage', this, '_onShowPage');
    this.watch('siblingNavVisible', dojo.hitch(this, '_onSiblingNavVisible'));
  },

  _onShowPage : function(page, node) {
    if (this.siblingNav) {
      this.set('siblingNavVisible', true);
      this.siblingNav.set('node', node);
    }

    this._setupAdTag();
  },

  _setupFeatureClasses : function() {
    dojo.forIn(toura.features, function(feature, enabled) {
      if (!enabled) { return; }
      dojo.addClass(this.body, 'feature-' + feature);
    }, this);
  },

  _setupSiblingNav : function() {
    if (!toura.features.siblingNav) { return; }
    if (toura.features.ads && this.appConfig.ads && this.appConfig.ads[m.Device.type]) { return; }

    var currentPage = m.app.UI.currentPage;

    this.siblingNav = m.app.UI.addPersistentComponent(toura.components.SiblingNav, {}, 'first');
    this.set('siblingNavVisible', false);

    dojo.connect(this.siblingNav, 'show', this, function() {
      if (currentPage) {
        currentPage.addClass(siblingNavClass);
        dojo.publish('/window/resize');
      }
    });

    dojo.connect(this.siblingNav, 'hide', this, function() {
      if (currentPage) {
        currentPage.removeClass(siblingNavClass);
        dojo.publish('/window/resize');
      }
    });
  },

  _setupAdTag : function() {
    if (!toura.features.ads) { return; }

    var currentPage = m.app.UI.currentPage,
        isHomeNode = currentPage && currentPage.baseObj.isHomeNode,
        b = dojo.body();

    if (this.adTag) {
      this.adTag.destroy();
    }

    if (isHomeNode) { return; }

    mulberry.app.PhoneGap.network.isReachable()
      .then(dojo.hitch(this, function(isReachable) {
        if (!isReachable) { return; }

        if (this.appConfig.ads && this.appConfig.ads[m.Device.type]) {
          if (currentPage) {
            currentPage.addClass(adsClass);
          }

          this.adTag = m.app.UI.addPersistentComponent(
            toura.components.AdTag,
            { adConfig : this.appConfig.ads[m.Device.type] },
            'last'
          );

          this.adTag.startup();
        }
      }));
  },

  _onSiblingNavVisible : function(k, old, visible) {
    if (!this.siblingNav) { return; }

    if (!this.siblingNav.siblings) {
      this.siblingNav.hide();
      return;
    }

    this.siblingNav[ visible ? 'show' : 'hide' ]();
  }
});

dojo.subscribe('/ui/ready', function() {
  toura.UI = new toura.UI();
});

}(mulberry));
