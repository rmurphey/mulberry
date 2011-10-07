dojo.provide('toura.capabilities.Page_Images');

dojo.require('toura.capabilities._Capability');

dojo.declare('toura.capabilities.Page_Images', [ toura.capabilities._Capability ], {
  requirements : {
    imageGallery : 'ImageGallery',
    imageCaption : 'ImageCaption'
  },

  connects : [
    [ 'page', 'init', '_setup' ]
  ],

  _setup : function(pageState) {
    var imageId = pageState.assetId,
        index, image;

    if (!imageId) { return; }

    image = dojo.filter(this.node.images, function(image, idx) {
      if (image.id === imageId) {
        index = idx;
        return image;
      }
    })[0];

    if (!image) { return; }

    if (this.imageGallery) {
      this.imageGallery.scrollToIndex(index);
    }

    if (this.imageCaption) {
      this.imageCaption.set('content', image.caption || '');
    }
  }
});

