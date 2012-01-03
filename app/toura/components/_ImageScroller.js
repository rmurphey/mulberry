dojo.provide('toura.components._ImageScroller');

dojo.require('vendor.iscroll');
dojo.require('toura.components._ImageGallery');

/**
 * This is a mixin to be used with components that include
 * an image scroller. It should not be used on its own.
 */
dojo.declare('toura.components._ImageScroller', toura.components._ImageGallery, {
  templateString : dojo.cache('toura.components', '_ImageScroller/ImageScroller.haml'),

  postMixInProperties : function() {
    this.inherited(arguments);
    this.useScroller = this.images.length > 1;
  },

  startup : function() {
    this.inherited(arguments);
    this._setupImageScroller();
  },

  _setupImageScroller : function() {
    if (this.useScroller && this.scrollerNode) {

      var self = this,
          node = this.scrollerNode.parentNode,
          scroller;

      scroller = this.scrollerHandle = new iScroll(node, {
        snap : true,
        momentum : false,
        hScrollbar : false,
        onScrollEnd : function() {
          self.set('currentImageIndex', this.currPageX);
          self.onScrollEnd(this.currPageX);
        }
      });

      scroller.refresh();
      this.onScrollerSetupComplete();
    }

    this.set('currentImageIndex', 0);
  },

  onScrollerSetupComplete : function() {
    console.log('toura.components._ImageScroller::onScrollerSetupComplete()');
    // stub for connections
  },

  onScrollEnd : function(imageIndex) {
    // stub for connection
  },

  _setWidth : function() {
    var pageWidth = toura.app.UI.viewport.width,
        scrollerWidth = this.images.length * pageWidth;

    this.scrollerNode.style.width = scrollerWidth + 'px';
    this.query('.image').style('width', pageWidth + 'px');
    if (!this.scrollerHandle) { return; }
    this.scrollerHandle.refresh();
    this.scrollToIndex(this.currentImageIndex);
  },

  _setCurrentImageIndexAttr : function(imageIndex) {
    this.inherited(arguments);

    dojo.forEach(this.indicator.childNodes, function(child) {
      dojo.removeClass(child, 'active');
    });
    dojo.addClass(this.indicator.childNodes[imageIndex], 'active');
  },

  postCreate : function() {
    this.inherited(arguments);

    // hide the dots if there's only one
    if (this.images.length <= 1) {
      this.hide(this.indicator);
    }
  },

  _updateIndicator : function() {
  },

  scrollToIndex : function(imageIndex) {
    if (!this.scrollerHandle) { return; }
    if (imageIndex === this.currentImageIndex) { return; }
    this.scrollerHandle.scrollToPage(imageIndex, 0, '0ms');
    this.set('currentImageIndex', imageIndex);
  },

  refresh : function() {
    if (!this.scrollerHandle) { return; }
    this.scrollerHandle.refresh();
  },

  destroy : function() {
    if (this.scrollerHandle) { this.scrollerHandle.destroy(); }
    this.inherited(arguments);
  }
});
