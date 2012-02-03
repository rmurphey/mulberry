dojo.provide('toura.capabilities.VideoList_VideoCaption');

dojo.require('mulberry._Capability');

dojo.declare('toura.capabilities.VideoList_VideoCaption', mulberry._Capability, {
  requirements : {
    videoList : 'VideoList',
    videoCaption : 'VideoCaption'
  },

  connects : [
    [ 'videoList', 'onSelect', '_setCaption' ]
  ],

  _setCaption : function(videoId) {
    var video = this.baseObj.getAssetById('video', videoId);
    if (!video) { return; }
    this.videoCaption.set('content', video.caption || '');
  }
});

