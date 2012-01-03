dojo.provide('toura.components.ImageGallery');

dojo.require('toura._Component');
dojo.require('toura.components._ImageScroller');

dojo.declare('toura.components.ImageGallery', [ toura._Component, toura.components._ImageScroller ], {
  'class' : 'image-gallery',
  prepareData : function() {
    this.images = dojo.map(this.node.images || [], function(img) {
      return dojo.mixin(img, {
        url : img.gallery.url,
        height : img.gallery.height,
        width : img.gallery.width
      });
    }, this);
  },

  postCreate : function() {
    this.scrollerNode = this.clickNode = this.imageList;
    this.inherited(arguments);
  },

  _handleClick : function() {
    this.onShowDetail(this.currentImageIndex);
  },

  onShowDetail : function(imageIndex) {
    // stub for connection
  }
});
