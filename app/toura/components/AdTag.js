dojo.provide('toura.components.AdTag');

dojo.require('toura._Component');

dojo.declare('toura.components.AdTag', toura._Component, {
  templateString : dojo.cache('toura.components', 'AdTag/AdTag.haml'),

  prep : function() {
  },

  startup : function() {
    var adConfig = toura.app.Config.get("app").ads,
        src = adConfig[this.device.type];

    if (src) {
      dojo.attr(this.adFrame,"src",src);
    } else {
      this.destroy();
    }
  }
});
