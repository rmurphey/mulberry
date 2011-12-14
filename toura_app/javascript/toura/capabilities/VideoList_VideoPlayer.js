dojo.provide('toura.capabilities.VideoList_VideoPlayer');

dojo.require('toura._Capability');

dojo.declare('toura.capabilities.VideoList_VideoPlayer', toura._Capability, {
  requirements : {
    videoList : 'VideoList',
    videoPlayer : 'VideoPlayer'
  },

  connects : [
    [ 'videoList', 'onSelect', '_playVideo' ]
  ],

  _playVideo : function(videoId) {
    this.videoPlayer.play(videoId);
  }
});

