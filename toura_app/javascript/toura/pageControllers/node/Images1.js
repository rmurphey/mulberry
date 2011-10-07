dojo.provide('toura.pageControllers.node.Images1');

dojo.require('toura.pageControllers.node._Node');
dojo.require('toura.pageControllers.node._ImageGalleryPage');

dojo.require('toura.components.BodyText');
dojo.require('toura.components.ImageCaption');
dojo.require('toura.components.ChildNodes');
dojo.require('toura.components.ImageGallery');
dojo.require('toura.components.ImageDetail');

dojo.declare('toura.pageControllers.node.Images1', [ toura.pageControllers.node._Node, toura.pageControllers.node._ImageGalleryPage ], {
  templateString : dojo.cache('toura.pageControllers.node', 'Images1/Images1.haml'),

  postMixInProperties : function() {
    this.inherited(arguments);

    this.placements = [
      [
        'BodyText',
        { node : this.node },
        'nodeText'
      ],
      [
        'ImageCaption',
        { node : this.node },
        'caption'
      ],
      [
        'ChildNodes',
        { node : this.node },
        'childNodes'
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
      ]
    ];
  },

  _setup : function() {
    this._imageGalleryPageSetup({
      caption : this.caption,
      fullScreen : this.detail,
      gallery : this.imageGallery
    });

    this.inherited(arguments);
  }
});
