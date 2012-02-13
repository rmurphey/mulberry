dojo.provide('toura.components.AdTag');

dojo.require('mulberry._Component');

dojo.declare('toura.components.AdTag', mulberry._Component, {
  templateString : dojo.cache('toura.components', 'AdTag/AdTag.haml'),

  adjustMarkup : function() {
    var appConfig = mulberry.app.Config.get('app');

    if (appConfig) {
      this.adConfig = appConfig.ads && appConfig.ads[this.device.type];
      this._refresh();
    }
  },

  setupSubscriptions : function() {
    this.subscribe('/page/transition/end', '_refresh');
  },

  startup : function() {
    if (!this.adConfig) {
      this.destroy();
    }
  },

  _setAdConfigAttr : function(val) {
    this.adConfig = val;
  },

  _refresh : function() {
    dojo.attr(this.adFrame, "src", this.adConfig);
  }
});
