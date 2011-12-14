dojo.provide('toura.components.VideoPlayer');

dojo.require('toura.components._MediaPlayer');
/*
 * Implements a video player which provides an acceptable interface accross all
 * supported environments.
 * On iOS:
 * Uses HTML5 <video> tag but renders the poster as an image. Hides the video when
 * the MoreDrawer is showing because it renders opn top of the MoreDrawer(?).
 * TODO: confirm whether this is still necessary
 *
 * On Android:
 * <video> tag doesn't work within Phonegap. So we render a poster image with a
 * fake button image on top, and call out to the native video player when the user
 * taps on it.
 */
dojo.declare('toura.components.VideoPlayer', toura.components._MediaPlayer, {
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
