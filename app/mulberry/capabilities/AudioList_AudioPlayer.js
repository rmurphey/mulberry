dojo.provide('mulberry.capabilities.AudioList_AudioPlayer');

dojo.require('mulberry._Capability');

dojo.declare('mulberry.capabilities.AudioList_AudioPlayer', [ mulberry._Capability ], {
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

