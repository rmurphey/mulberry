dojo.provide('toura.components.AudioList');

dojo.require('mulberry._Component');
dojo.require('toura.components.AssetList');

dojo.declare('toura.components.AudioList', toura.components.AssetList, {
  "class" : 'audio-list',

  postMixInProperties : function() {
    this.assets = this.node.audios || [];
    this.inherited(arguments);
  }
});


