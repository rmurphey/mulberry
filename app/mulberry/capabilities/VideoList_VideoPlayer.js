dojo.provide('mulberry.capabilities.VideoList_VideoPlayer');

dojo.require('mulberry._Capability');

dojo.declare('mulberry.capabilities.VideoList_VideoPlayer', mulberry._Capability, {
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

