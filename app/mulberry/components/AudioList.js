dojo.provide('mulberry.components.AudioList');

dojo.require('mulberry._Component');
dojo.require('mulberry.components.AssetList');

dojo.declare('mulberry.components.AudioList', mulberry.components.AssetList, {
  "class" : 'audio-list',

  postMixInProperties : function() {
    this.assets = this.node.audios || [];
    this.inherited(arguments);
  }
});


