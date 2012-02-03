dojo.provide('toura.capabilities.AudioList_AudioCaption');

dojo.require('mulberry._Capability');

dojo.declare('toura.capabilities.AudioList_AudioCaption', mulberry._Capability, {
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

