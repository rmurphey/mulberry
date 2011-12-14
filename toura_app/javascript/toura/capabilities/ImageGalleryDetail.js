dojo.provide('toura.capabilities.ImageGalleryDetail');

dojo.require('toura._Capability');
dojo.require('toura.app.UI');

dojo.declare('toura.capabilities.ImageGalleryDetail', [ toura._Capability ], {
  requirements : {
    imageGallery : 'ImageGallery',
    imageDetail : 'ZoomableImageGallery',
    detailTitle : 'DetailTitle'
  },

  connects : [
    [ 'imageGallery', 'onShowDetail', '_showDetail' ],
    [ 'detailTitle', 'onClose', '_hideDetail' ],
    [ 'imageDetail', 'onImageChange', '_setTitle' ],
    [ 'imageDetail', 'onShowChrome', '_showDetailTitle' ],
    [ 'imageDetail', 'onHideChrome', '_hideDetailTitle' ]
  ],

  _showDetail : function(imageIndex) {
    toura.app.UI.set('siblingNavVisible', false);
    this.detailTitle.hide();
    this.page.showScreen('detail');
    this.imageDetail.set('currentImageIndex', imageIndex);
    this.imageDetail.set('chromeVisible', false);
  },

  _hideDetail : function(imageIndex) {
    this.page.showScreen('index');
    toura.app.UI.set('siblingNavVisible', true);
    this.imageGallery.scrollToIndex(this.imageDetail.currentImageIndex);
  },

  _setTitle : function(image) {
    this.detailTitle.set('screenTitle', image.name);
  },

  _showDetailTitle : function() {
    this.detailTitle.show();
  },

  _hideDetailTitle : function() {
    this.detailTitle.hide();
  }
});
