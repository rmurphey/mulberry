dojo.provide('toura.components.AdTag');

dojo.require('mulberry._Component');

dojo.declare('toura.components.AdTag', mulberry._Component, {
  templateString : dojo.cache('toura.components', 'AdTag/AdTag.haml'),

  adjustMarkup : function() {
    var adConfig = toura.app.Config.get("app").ads,
        src = adConfig[this.device.type];

    dojo.attr(this.adFrame,"src",src);
  },

  startup : function() {
    var src = toura.app.Config.get("app").ads[this.device.type];

    if (!src) {
      this.destroy();
    }
  }
});
