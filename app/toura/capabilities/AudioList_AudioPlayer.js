dojo.provide('toura.capabilities.AudioList_AudioPlayer');

dojo.require('mulberry._Capability');

dojo.declare('toura.capabilities.AudioList_AudioPlayer', mulberry._Capability, {
  requirements : {
    audioList : 'AudioList',
    audioPlayer : 'AudioPlayer'
  },

  connects : [
    [ 'audioList', 'onSelect', '_playAudio' ]
  ],

  _playAudio : function(audioId) {
    this.audioPlayer.play(audioId);
  }
});

