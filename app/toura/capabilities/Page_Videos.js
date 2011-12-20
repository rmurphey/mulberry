dojo.provide('toura.capabilities.Page_Videos');

dojo.require('toura._Capability');

dojo.declare('toura.capabilities.Page_Videos', toura._Capability, {
  requirements : {
    videoPlayer : 'VideoPlayer',
    videoList : 'VideoList'
  },

  connects : [
    [ 'page', 'init', '_setup' ]
  ],

  _setup : function(pageState) {
    this._loadVideo(pageState);
  },

  _loadVideo : function(pageState) {
    // only when navigating directly to the video instead of just the node
    if (!pageState.assetId || pageState.assetType !== 'videos') { return; }

    var videoId = pageState.assetId,
        video = this._videoById(videoId);

    if (this.videoList) {
      this.videoList.set('currentAsset', videoId);
    }

    if (this.videoCaption) {
      this.videoCaption.set('content', video.caption || '');
    }

    this.videoPlayer.set('mediaId', videoId);
  }
});
