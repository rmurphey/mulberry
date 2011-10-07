dojo.provide('toura.pageControllers.node.Audios1');

dojo.require('toura.pageControllers.node._Node');
dojo.require('toura.pageControllers.node._ImageGalleryPage');

dojo.require('toura.components.BodyText');
dojo.require('toura.components.AudioCaption');
dojo.require('toura.components.ImageCaption');
dojo.require('toura.components.ImageGallery');
dojo.require('toura.components.ImageDetail');
dojo.require('toura.components.AudioPlayer');
dojo.require('toura.components.ChildNodes');
dojo.require('toura.components.AudioList');

dojo.declare('toura.pageControllers.node.Audios1', [
  toura.pageControllers.node._Node,
  toura.pageControllers.node._ImageGalleryPage
], {

  templateString : dojo.cache('toura.pageControllers.node', 'Audios1/Audios1.haml'),

  postMixInProperties : function() {
    this.inherited(arguments);

    this.audiosCache = {};

    this.audios = dojo.map(this.node.audios, function(audio, idx) {
      this.audiosCache[audio.id] = audio = dojo.mixin(audio, {
        index : idx
      });
      return audio;
    }, this);

    this.placements = [
      [
        'AudioPlayer',
        { node : this.node },
        'audioPlayer',
        'replace'
      ],

      [
        'ImageGallery',
        { node : this.node },
        'imageGallery'
      ],

      [
        'ImageDetail',
        { node : this.node },
        'detail',
        'replace'
      ],

      [
        'ChildNodes',
        { node : this.node },
        'childNodes',
        'replace'
      ],

      [
        'AudioCaption',
        { node : this.node },
        'audioCaption'
      ],

      [
        'BodyText',
        { node : this.node },
        'bodyText'
      ],

      [
        'ImageCaption',
        { node : this.node },
        'imageCaption'
      ]
    ];

    if (this.node.audios.length > 1) {
      this.placements.push([
        'AudioList',
        { node : this.node },
        'audioList'
      ]);
    } else {
      dojo.destroy(this.audioList);
    }
  },

  postCreate : function() {
    this.inherited(arguments);

    this.connect(this.audioList, 'onSelect', function(assetId) {
      var audio = this._audioById(assetId);
      this.audioPlayer.play(assetId);
      this.audioCaption.set('content', audio.caption || '');
      dojo.publish('/content/update');
    });

    if (this.audioPlayer.useHtml5Player) {
      // we need to hide the player when in full-screen image gallery mode
      this.subscribe('/ImageGalleryPage/detail/show', 'togglePlayer');
      this.subscribe('/ImageGalleryPage/detail/hide', 'togglePlayer');
    }
  },

  _audioById : function(assetId) {
    return this.audiosCache[assetId] || false;
  },

  _setup : function() {
    this._imageGalleryPageSetup({
      gallery : this.imageGallery,
      caption : this.imageCaption,
      fullScreen : this.detail
    });
  },

  init : function(pageState) {
    if (!pageState.assetId || pageState.assetType !== 'audios') { return; }

    var audioId = pageState.assetId,
        audio = this._audioById(audioId);

    if (this.audioList) {
      this.audioList.set('currentAsset', audioId);
    }

    if (this.audioCaption) {
      this.audioCaption.set('content', audio.caption || '');
    }

    this.audioPlayer.set('mediaId', audioId);
  },

  togglePlayer : function() {
    this.audioPlayer.toggle();
  }
});
