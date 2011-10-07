dojo.provide('toura.pageControllers.node.Videos1');

dojo.require('toura.pageControllers.node._Node');

dojo.require('toura.components.BodyText');
dojo.require('toura.components.ChildNodes');
dojo.require('toura.components.VideoList');
dojo.require('toura.components.VideoPlayer');
dojo.require('toura.components.VideoCaption');

dojo.declare('toura.pageControllers.node.Videos1', [ toura.pageControllers.node._Node ], {
  templateString : dojo.cache('toura.pageControllers.node', 'Videos1/Videos1.haml'),

  postMixInProperties : function() {
    this.inherited(arguments);

    this.videosCache = {};

    this.videos = dojo.map(this.node.videos, function(video, idx) {
      this.videosCache[video.id] = video = dojo.mixin(video, {
        index : idx
      });
      return video;
    }, this);

    this.placements = [
      [
        'BodyText',
        { node : this.node },
        'bodyText'
      ],
      [
        'VideoCaption',
        { node : this.node },
        'videoCaption'
      ],
      [
        'ChildNodes',
        { node : this.node },
        'childNodes'
      ],
      [
        'VideoPlayer',
        { node : this.node },
        'videoPlayer'
      ]
    ];

    if (this.node.videos.length > 1) {
      this.placements.push([
        'VideoList',
        { node : this.node },
        'videoList'
      ]);
    } else {
      dojo.destroy(this.videoList);
    }
  },

  postCreate : function() {
    this.inherited(arguments);

    this.connect(this.videoList, 'onSelect', function(assetId) {
      var video = this._videoById(assetId);
      this.videoCaption.set('content', video.caption || '');
      this.videoPlayer.play(assetId);
      dojo.publish('/content/update');
    });

    if (this.videoPlayer.useHtml5Player) {
      // we need to hide the video when the more drawer shows :(
      this.subscribe('/MoreDrawer/show', dojo.hitch(this.videoPlayer, 'disable'));
      this.subscribe('/MoreDrawer/hide', dojo.hitch(this.videoPlayer, 'enable'));
    }
  },

  init : function(pageState) {
    if (!pageState.assetId || pageState.assetType !== 'videos') { return; }

    var videoId = pageState.assetId,
        video = this._videoById(videoId);

    if (this.videoList) {
      this.videoList.set('currentAsset', videoId);
    }

    this.videoPlayer.set('mediaId', videoId);
    this.videoCaption.set('content', video.caption || '');
  },

  _videoById : function(assetId) {
    return this.videosCache[assetId] || false;
  }

});
