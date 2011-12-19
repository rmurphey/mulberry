dojo.provide('toura.capabilities.Page_FullScreenImages');

dojo.require('toura._Capability');

dojo.declare('toura.capabilities.Page_FullScreenImages', [ toura._Capability ], {
  requirements : {
    imageGallery : 'ZoomableImageGallery',
    pageNav : 'PageNav'
  },

  connects : [
    [ 'page', 'init', '_setup' ],
    [ 'imageGallery', 'onHideChrome', '_hideNav' ],
    [ 'imageGallery', 'onShowChrome', '_showNav' ]
  ],

  _setup : function(pageState) {
    var index = 0;

    if (pageState.assetId) {
      dojo.forEach(this.baseObj.images, function(image, idx) {
        if (image.id === pageState.assetId) { index = idx; }
      });
    }

    this.imageGallery.set('currentImageIndex', index);
  },

  _hideNav : function() {
    this.pageNav.hide();
  },

  _showNav : function() {
    this.pageNav.show();
  }
});

