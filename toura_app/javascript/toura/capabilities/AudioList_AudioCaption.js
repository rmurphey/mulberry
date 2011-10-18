dojo.provide('toura.capabilities.AudioList_AudioCaption');

dojo.declare('toura.capabilities.AudioList_AudioCaption', [ toura.capabilities._Capability ], {
  requirements : {
    audioList : 'AudioList',
    audioCaption : 'AudioCaption'
  },

  connects : [
    [ 'audioList', 'onSelect', '_setCaption' ]
  ],

  _setCaption : function(audioId) {
    var audio = this.baseObj.getAssetById('audio', audioId);
    if (!audio) { return; }
    this.audioCaption.set('content', audio.caption || '');
  }
});

