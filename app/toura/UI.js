dojo.provide('toura.UI');

dojo.require('dojo.Stateful');

dojo.require('toura.components.SiblingNav');
dojo.require('toura.components.AdTag');

(function(m) {

dojo.declare('toura.UI', dojo.Stateful, {
  constructor : function() {
    this.body = dojo.body();

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
    if (!toura.features.siblingNav || toura.features.ads) { return; }

    this.siblingNav = m.app.UI.addPersistentComponent(toura.components.SiblingNav, {}, 'first');
    this.set('siblingNavVisible', false);

    dojo.connect(this.siblingNav, 'show', this, function() {
      dojo.addClass(this.body, 'sibling-nav-visible');
      dojo.publish('/window/resize');
    });

    dojo.connect(this.siblingNav, 'hide', this, function() {
      dojo.removeClass(this.body, 'sibling-nav-visible');
      dojo.publish('/window/resize');
    });
  },

  _setupAdTag : function() {
    if (!toura.features.ads) { return; }

    var isHomeNode = m.app.UI.currentPage && m.app.UI.currentPage.baseObj.isHomeNode,
        b = dojo.body();

    if (this.adTag) {
      this.adTag.destroy();
    }

    if (isHomeNode) {
      dojo.removeClass(b, 'has-ads');
      return;
    }

    mulberry.app.PhoneGap.network.isReachable()
      .then(dojo.hitch(this, function(isReachable) {
        if (!isReachable) {
          dojo.removeClass(b, 'has-ads');
          return;
        }

        var appConfig = mulberry.app.Config.get('app');

        if (appConfig.ads && appConfig.ads[m.Device.type]) {
          dojo.addClass(b, 'has-ads');

          this.adTag = m.app.UI.addPersistentComponent(
            toura.components.AdTag,
            { adConfig : appConfig.ads[m.Device.type] },
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
