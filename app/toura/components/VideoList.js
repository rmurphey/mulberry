dojo.provide('toura.components.VideoList');

dojo.require('toura.components.AssetList');

dojo.declare('toura.components.VideoList', toura.components.AssetList, {
  "class" : 'video-list',

  postMixInProperties : function() {
    this.assets = this.node.videos || [];
    this.inherited(arguments);
  },
  
  adjustMarkup : function() {
    console.log(this.assets, this.node.videos);
    if (this.assets.length <= 1) {
      this.addClass('hide-playlist');
    }
  },
});

