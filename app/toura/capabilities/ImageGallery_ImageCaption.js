dojo.provide('toura.capabilities.ImageGallery_ImageCaption');

dojo.require('toura._Capability');

dojo.declare('toura.capabilities.ImageGallery_ImageCaption', [ toura._Capability ], {
  requirements : {
    imageGallery : 'ImageGallery',
    imageCaption : 'ImageCaption'
  },

  connects : [
    [ 'imageGallery', 'onScrollEnd', '_setCaption' ]
  ],

  _setCaption : function(imageIndex) {
    var image = this.baseObj.images[imageIndex];
    this.imageCaption.set('content', image && image.caption || '');
  }
});
