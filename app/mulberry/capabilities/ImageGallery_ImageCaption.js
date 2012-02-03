dojo.provide('mulberry.capabilities.ImageGallery_ImageCaption');

dojo.require('mulberry._Capability');

dojo.declare('mulberry.capabilities.ImageGallery_ImageCaption', [ mulberry._Capability ], {
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
