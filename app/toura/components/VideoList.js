dojo.provide('toura.components.VideoList');

dojo.require('toura.components.AssetList');

dojo.declare('toura.components.VideoList', toura.components.AssetList, {
  "class" : 'video-list',

  postMixInProperties : function() {
    this.assets = this.node.videos || [];
    this.inherited(arguments);
  },

  adjustMarkup : function() {
    if (this.assets.length <= 1) {
      this.hide();
    }
  }
});

