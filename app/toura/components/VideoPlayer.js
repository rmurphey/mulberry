dojo.provide('toura.components.VideoPlayer');

dojo.require('toura.components._MediaPlayer');
/*
 * Implements a video player which provides an acceptable interface accross all
 * supported environments.
 * On iOS:
 * Uses HTML5 <video> tag. Hides the video when the MoreDrawer is showing
 * because tap events on the MoreDrawer still get picked up by the player and
 * cause the video to start playing. (confirmed in ios 5.0)
 *
 * On Android:
 * <video> tag doesn't work within Phonegap. So we render a poster image with a
 * fake button image on top, and call out to the native video player when the user
 * taps on it.
 */
dojo.declare('toura.components.VideoPlayer', toura.components._MediaPlayer, {
  templateString : dojo.cache('toura.components', 'VideoPlayer/VideoPlayer.haml'),

  widgetsInTemplate : true,
  playerType : 'video',

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
  },

  startup : function() {
    this.inherited(arguments);

    if (this.media.poster) {
      this.videoPlaceholder.loadImage();
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
      this.videoPlaceholder.set('imageUrl', poster);
      return;
    }

    if (this.player) {
      this.player.poster = poster || '';
    }
  }
});
