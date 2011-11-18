dojo.provide('toura.capabilities.VideoList_VideoPlayer');

dojo.declare('toura.capabilities.VideoList_VideoPlayer', [ toura.capabilities._Capability ], {
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

