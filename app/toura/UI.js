dojo.provide('toura.UI');

dojo.require('dojo.Stateful');

dojo.require('toura.components.SiblingNav');
dojo.require('toura.components.AdTag');

(function(m) {

dojo.declare('toura.UI', dojo.Stateful, {
  constructor : function() {
    var s = dojo.subscribe('/ui/ready', dojo.hitch(this, function() {
      dojo.unsubscribe(s);
      this.body = dojo.body();
      this._init();
    }));

    this.watch('siblingNavVisible', dojo.hitch(this, '_onSiblingNavVisible'));
  },

  _init : function() {
    this._setupFeatureClasses();
    this._setupSiblingNav();
    this._setupAdTag();

    dojo.connect(m.app.UI, 'showPage', this, '_onShowPage');
  },

  _onShowPage : function(page, node) {
    if (!this.siblingNav) { return; }
    this.set('siblingNavVisible', true);
    this.siblingNav.set('node', node);
  },

  _setupFeatureClasses : function() {
    dojo.forIn(toura.features, function(feature, enabled) {
      if (!enabled) { return; }
      dojo.addClass(this.body, 'feature-' + feature);
    }, this);
  },

  _setupSiblingNav : function() {
    if (!toura.features.siblingNav) { return; }
    this.siblingNav = m.app.UI.addPersistentComponent(toura.components.SiblingNav);
    this.set('siblingNavVisible', false);
  },

  _setupAdTag : function() {
    if (!toura.features.ads) { return; }
    mulberry.app.PhoneGap.network.isReachable()
      .then(function(isReachable) {
        if (!isReachable) { return; }
        m.app.UI.addPersistentComponent(toura.components.AdTag);
      });
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

dojo.subscribe('/app/ready', function() {
  toura.UI = new toura.UI();
});

}(mulberry));
