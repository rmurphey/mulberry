dojo.provide('toura.capabilities.AudioList_AudioCaption');

dojo.declare('toura.capabilities.AudioList_AudioCaption', [ toura.capabilities._Capability ], {
  components : {
    audioList : 'AudioList',
    audioCaption : 'AudioCaption'
  },

  connects : [
    [ 'audioList', 'onSelect', '_setCaption' ]
  ],

  _setCaption : function(audioId) {
    var audio = this.node.getAssetById('audio', audioId);
    if (!audio) { return; }
    this.audioCaption.set('content', audio.caption || '');
  }
});

