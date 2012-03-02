dojo.provide('toura.components.AdTag');

dojo.require('mulberry._Component');

dojo.declare('toura.components.AdTag', mulberry._Component, {
  templateString : dojo.cache('toura.components', 'AdTag/AdTag.haml'),

  adjustMarkup : function() {
    if (this.adConfig) {
      dojo.attr(this.adFrame, "src", this.adConfig);
    }
  },

  startup : function() {
    if (!this.adConfig) {
      this.destroy();
    }
  }
});
