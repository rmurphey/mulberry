dojo.provide('toura.components.AdTag');

dojo.require('mulberry._Component');

dojo.declare('toura.components.AdTag', mulberry._Component, {
  templateString : dojo.cache('toura.components', 'AdTag/AdTag.haml'),

  adjustMarkup : function() {
    var appConfig = mulberry.app.Config.get('app');

    if (appConfig) {
      this.adConfig = appConfig.ads && appConfig.ads[this.device.type];
      if (this.adConfig) {
        this.refresh();
      }
    }
  },

  startup : function() {
    if (!this.adConfig) {
      this.destroy();
    }
  },

  refresh : function() {
    var adConfig = this.adConfig + (
          this.adConfig.match('!') ?  '&' : '?'
        ) + '_touracachebust=' + Math.random();

    dojo.attr(this.adFrame, "src", adConfig);
  }
});
