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
    this._setupAdTag();

    dojo.connect(m.app.UI, 'showPage', this, '_onShowPage');
    this.watch('siblingNavVisible', dojo.hitch(this, '_onSiblingNavVisible'));
  },

  _onShowPage : function(page, node) {
    if (this.siblingNav) {
      this.set('siblingNavVisible', true);
      this.siblingNav.set('node', node);
    }

    if (this.adTag) {
      this.adTag.destroy();
      this._setupAdTag();
    }
  },

  _setupFeatureClasses : function() {
    dojo.forIn(toura.features, function(feature, enabled) {
      if (!enabled) { return; }
      dojo.addClass(this.body, 'feature-' + feature);
    }, this);
  },

  _setupSiblingNav : function() {
    if (!toura.features.siblingNav) { return; }
    this.siblingNav = m.app.UI.addPersistentComponent(toura.components.SiblingNav, {}, 'first');
    this.set('siblingNavVisible', false);
  },

  _setupAdTag : function() {
    if (!toura.features.ads) { return; }
    mulberry.app.PhoneGap.network.isReachable()
      .then(dojo.hitch(this, function(isReachable) {
        var deviceType = dojo.hasClass(dojo.body(), "phone") ? "phone" : "tablet";
        if (!isReachable) {
          dojo.removeClass(dojo.body(), 'has-ads');
          return;
        } else if (mulberry.app.Config.get('app').ads[deviceType]) {
          dojo.addClass(dojo.body(), 'has-ads');
        }
        this.adTag = m.app.UI.addPersistentComponent(toura.components.AdTag, {}, 'last');
        this.adTag.startup();
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
