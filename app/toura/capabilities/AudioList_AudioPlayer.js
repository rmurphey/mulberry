dojo.provide('toura.capabilities.AudioList_AudioPlayer');

dojo.require('toura._Capability');

dojo.declare('toura.capabilities.AudioList_AudioPlayer', [ toura._Capability ], {
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

