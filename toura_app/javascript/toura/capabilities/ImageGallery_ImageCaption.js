dojo.provide('toura.capabilities.ImageGallery_ImageCaption');

dojo.require('toura.capabilities._Capability');

dojo.declare('toura.capabilities.ImageGallery_ImageCaption', [ toura.capabilities._Capability ], {
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
    dojo.publish('/content/update');
  }
});
