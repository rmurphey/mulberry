dojo.provide('toura.components.VideoPlayer');

dojo.require('toura.components._MediaPlayer');
dojo.require('toura.Utilities');

dojo.declare('toura.components.VideoPlayer', [ toura.components._MediaPlayer ], {
  templateString : dojo.cache('toura.components', 'VideoPlayer/VideoPlayer.haml'),

  playerType : 'video',
  defaultPoster : './icons/video-poster.png',
  aspectRatio : 3/4,

  playerSettings : {
    controls : true
  },

  prepareData : function() {
    this.medias = this.node.videos || [];
    this.inherited(arguments);

    if (this.useHtml5Player && this.media.poster) {
      this.playerSettings = dojo.mixin(this.playerSettings, {
        poster : this.media.poster
      });
    }

    if (!this.useHtml5Player) {
      this.poster = this.media.poster || this.defaultPoster;
    }
  },

  setupConnections : function() {
    this.inherited(arguments);

    if (this.useHtml5Player) { 
      // we need to hide the video when the more drawer shows :(
      this.subscribe('/MoreDrawer/show', dojo.hitch(this, 'disable'));
      this.subscribe('/MoreDrawer/hide', dojo.hitch(this, 'enable'));
      return; 
    }

    this.connect(this.videoPlaceholder, 'click', '_play');

    this.connect(this.playButton, 'click', '_play');
  },

  startup : function() {
    if (this.useHtml5Player) {
      toura.util.copyStyles(this.player, this.overlay, [ 'width', 'height' ]);
    }
  },

  _play : function(media) {
    this.inherited(arguments);

    if (this.useHtml5Player) { return; }

    toura.app.PhoneGap.browser.url(this.media.url);
  },

  _setMediaIdAttr : function(mediaId) {
    this.inherited(arguments);

    this.set('poster', this.media.poster);
  },

  _setPosterAttr : function(poster) {
    if (!this.useHtml5Player) {
      var width = toura.app.UI.viewport.width;

      this.videoPlaceholder.width = width;
      this.videoPlaceholder.src = poster || this.defaultPoster;

      dojo.style(this.playButton, {
        'width': width + 'px',
        'height': Math.floor(width * this.aspectRatio) + 'px'
      });

      return;
    }

    if (this.player) {
      this.player.poster = poster || '';
    }
  }
});
