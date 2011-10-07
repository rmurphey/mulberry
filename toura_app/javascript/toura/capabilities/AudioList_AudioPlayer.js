dojo.provide('toura.capabilities.AudioList_AudioPlayer');

dojo.declare('toura.capabilities.AudioList_AudioPlayer', [ toura.capabilities._Capability ], {
  components : {
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

