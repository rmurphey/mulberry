dojo.provide('toura.components._MediaPlayer');

dojo.require('toura._Component');

(function() {
var pg = toura.app.PhoneGap;

dojo.declare('toura.components._MediaPlayer', toura._Component, {
  useHtml5Player : true,

  prepareData : function() {
    this.inherited(arguments);
    this.mediasCache = {};

    this.medias = dojo.map(this.medias || [], function(media) {
      this.mediasCache[media.id] = media = dojo.mixin(media, {
        assetUrl : [ this.baseUrl, media.id ].join('/')
      });
      return media;
    }, this);

    this.media = this.medias[0] || null;
    this.useHtml5Player = toura.app.Has.html5Player();
  },

  setupSubscriptions : function() {
    this.inherited(arguments);
    if (!this.useHtml5Player) { return; }
    this.subscribe('/page/transition/end', '_setupPlayer');
  },

  adjustMarkup : function() {
    if (!this.useHtml5Player) {
      this.addClass('has-html5-player');
    }
  },

  play : function(mediaId) {
    this.set('mediaId', mediaId);
    this._play(this.media);
  },

  _play : function(media) {
    if (this.useHtml5Player) {
      this.player.play();
    }

    dojo.publish('/' + this.playerType + '/play', [ this.media.id ]);
  },

  _pause : function() {
    if (this.useHtml5Player && this.player) {
      this.player.pause();
    }
  },

  _setMediaIdAttr : function(mediaId) {
    var media = this.media = this.mediasCache[mediaId];

    if (this.useHtml5Player && !this.player) {
      this._queuedMedia = media;
      return;
    }

    this._queuedMedia = null;

    if (this.player) {
      this.player.src = media.url;
    }
  },

  _setupPlayer : function() {
    if (!this.useHtml5Player) { return; }
    if (!this.media) { return; }

    var media = this.media,
        domNode = this.domNode,
        player = this.player = dojo.create(
          this.playerType,
          dojo.mixin({ src : media.url }, this.playerSettings)
        ),
        doIt = dojo.partial(dojo.place, player, domNode);

    var c = dojo.connect(player, 'loadstart', this, function() {
      dojo.disconnect(c);
      c = false;
      if (!domNode) { return; }
      doIt();
    });

    // iOS 4.1 fail
    setTimeout(function() {
      if (!c) { return; }
      dojo.disconnect(c);
      doIt();
    }, 100);

  }
});

}());
