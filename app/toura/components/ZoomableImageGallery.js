dojo.provide('toura.components.ZoomableImageGallery');

dojo.require('toura.components._ImageGallery');
dojo.require('toura.components.ImageCaption');
dojo.require('toura.ui.PinchZoom');

dojo.declare('toura.components.ZoomableImageGallery', [ toura._Component, toura.components._ImageGallery, toura.ui.PinchZoom ], {
  templateString : dojo.cache('toura.components', 'ZoomableImageGallery/ZoomableImageGallery.haml'),
  widgetsInTemplate : true,
  chromeVisible : false,

  prepareData : function() {
    this.inherited(arguments);

    this.images = dojo.map(this.node.images || [], function(img) {
      var imgType = { tablet : 'original', phone : 'gallery' }[ this.device.type ];

      dojo.forEach([ 'url', 'height', 'width' ], function(prop) {
        img[prop] = img[imgType][prop];
      });

      return img;
    }, this);
  },

  setupConnections : function() {
    this.clickNode = this.imageList;
    this.connect(this.nextButton, 'click', this._go(1));
    this.connect(this.prevButton, 'click', this._go(-1));
  },

  _go : function(increment) {
    return dojo.hitch(this, function() {
      this.set('currentImageIndex', this.currentImageIndex + increment);
    });
  },

  _setCurrentImageIndexAttr : function(imageIndex) {
    this.inherited(arguments);

    var img = this.images[imageIndex];
    this.set('caption', img.caption || '');

    this._updateImages(imageIndex);
    this._updateButtons(imageIndex);

    this.onImageChange(img);
  },

  _handleClick : function() {
    this.set('chromeVisible', !this.chromeVisible);
  },

  _setChromeVisibleAttr : function(visible) {
    // show/hide it
    this[ visible ? 'removeClass' : 'addClass' ]('chrome-hidden');
    this.chromeVisible = visible;

    // announce it
    this[ visible ? 'onShowChrome' : 'onHideChrome' ]();
  },

  onShowChrome : function() {
    // stub for connection
  },

  onHideChrome : function() {
    // stub for connection
  },

  onImageChange : function(image) {
    // stub for connection
  },

  _updateImages : function(imageIndex) {
    dojo.forEach(this.bgImgs, function(widget, index) {
      var n = widget.domNode.parentNode,
          isCurrentImage = index === imageIndex;

      this[isCurrentImage ? 'show' : 'hide'](n);
      if (!isCurrentImage) { return; }

      this._makeScroller(n);
    }, this);
  },

  _updateButtons : function(imageIndex) {
    var isFirst = imageIndex === 0,
        isLast = imageIndex === (this.images.length - 1);

    this[isFirst ? 'hide' : 'show'](this.prevButton);
    this[isLast ? 'hide' : 'show'](this.nextButton);
  },

  _setCaptionAttr : function(caption) {
    this.caption.set('content', caption);

    this.caption[caption ? 'show' : 'hide']();
  }
});

