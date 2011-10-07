dojo.provide('toura.components.ImageDetail');

dojo.require('toura.components._Component');
dojo.require('toura.components._ImageGallery');
dojo.require('toura.components.PageNav');
dojo.require('toura.components.DetailTitle');
dojo.require('toura.ui.PinchZoom');

dojo.declare('toura.components.ImageDetail', [ toura.components._Component, toura.components._ImageGallery, toura.ui.PinchZoom ], {
  templateString : dojo.cache('toura.components', 'ImageDetail/ImageDetail.haml'),
  widgetsInTemplate : true,
  main : false,

  prepareData : function() {
    var device = this.device;

    this.imageCache = {};

    this.images = dojo.map(this.node.images || [], function(img) {
      this.imageCache[img.id] = img;
      return dojo.mixin(img, (device.type === 'tablet' ? {
          url : img.original.url,
          height : img.original.height,
          width : img.original.width
        } : {
          url : img.gallery.url,
          height : img.gallery.height,
          width : img.gallery.width
        })
      );
    }, this);
  },

  postCreate : function() {
    this.nav = this.adopt(
      this.main ? toura.components.PageNav : toura.components.DetailTitle,
      { node : this.node }
    ).placeAt(this.nav, 'replace');

    this.clickNode = this.imageList;
    this.cleanView = this.main ? true : false;

    this._toggleCleanView();
    this.connect(this.nav, 'onClose', '_hideDetail');

    this.connect(this.nextButton, 'click', this._go(1));
    this.connect(this.prevButton, 'click', this._go(-1));

    this.set('active', false);

    this.inherited(arguments);
  },

  showNav : function() {
    this.removeClass('clean');
  },

  _go : function(increment) {
    return dojo.hitch(this, function() {
      this.set('currentImageIndex', this.currentImageIndex + increment);
    });
  },

  _handleClick : function() {
    this._toggleCleanView();
  },

  _hideDetail : function() {
    this.set('active', false);
    this.onHideDetail(this.currentImageIndex);
    if (!this.scroller) { return; }
    this.scroller.zoom(0, 0, 1);
  },

  onHideDetail : function(imageIndex) {
    // stub for connections
    console.log('ImageDetail::onHideDetail()', imageIndex);
  },

  onScrollerSetupComplete : function() {
    this.set('active', false);
  },

  _setActiveAttr : function(active) {
    dojo[active ? 'removeClass' : 'addClass'](this.domNode, 'hidden');
  },

  _toggleCleanView : function() {
    var clean = this.cleanView = !this.cleanView;
    dojo[clean ? 'addClass' : 'removeClass'](this.domNode, 'clean');
  },

  _setCurrentImageIndexAttr : function(imageIndex) {
    this.inherited(arguments);

    var img = this.images[imageIndex];
    this.set('caption', img.caption);
    this.nav.set('screenTitle', img && img.name || '');

    if (this.scroller) { this.scroller.destroy(); }

    this.bgImgs.forEach(function(widget, index) {
      var listItem = widget.domNode.parentNode,
          isCurrentImage = index === imageIndex;

      dojo[isCurrentImage ? 'removeClass' : 'addClass'](listItem, 'hidden');
      if (!isCurrentImage) { return; }
      this._makeScroller(listItem);
    }, this);

    var isFirst = imageIndex === 0,
        isLast = imageIndex === (this.images.length - 1);

    dojo[isFirst ? 'addClass' : 'removeClass'](this.prevButton, 'hidden');
    dojo[isLast ? 'addClass' : 'removeClass'](this.nextButton, 'hidden');
  },

  _setCaptionAttr : function(caption) {
    var container = this.captionContainer;
    this.caption = caption;

    if (caption) {
      container.innerHTML = caption;
      dojo.removeClass(container, 'hidden');
    } else {
      dojo.empty(container);
      dojo.addClass(container, 'hidden');
    }
  },

  initializeStrings : function() {
    this.i18n_prev = this.getString('PREVIOUS');
    this.i18n_next = this.getString('NEXT');
  }

});
