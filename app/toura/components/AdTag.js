dojo.provide('toura.components.AdTag');

dojo.require('toura._Component');

dojo.declare('toura.components.AdTag', toura._Component, {
  templateString : dojo.cache('toura.components', 'AdTag/AdTag.haml'),

  adjustMarkup : function() {
    var src = TouraAppConfig.ads[this.device.type];
    dojo.attr(this.adFrame,"src",src);
  }
});
