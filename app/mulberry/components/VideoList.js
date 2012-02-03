dojo.provide('mulberry.components.VideoList');

dojo.require('mulberry.components.AssetList');

dojo.declare('mulberry.components.VideoList', mulberry.components.AssetList, {
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

