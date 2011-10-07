dojo.provide('toura.components.NodeGallery');

dojo.require('toura.components._ImageScroller');

dojo.declare('toura.components.NodeGallery', [ toura.components._Component, toura.components._ImageScroller ], {
  templateString : dojo.cache('toura.components', 'NodeGallery/NodeGallery.haml'),
  'class' : 'node-gallery',

  prepareData : function() {
    this.node.populateChildren();
    this.children = this.node.children;

    this.images = dojo.map(this.children || [], function(child) {
      var img = child.images[0];

      return dojo.mixin(img, this.phone ? {
        url : img.gallery.url,
        height : img.gallery.height,
        width : img.gallery.width
      } : {
        url : img.original.url,
        height : img.original.height,
        width : img.original.width
      });
    }, this);
  },

  postCreate : function() {
    this.scrollerNode = this.clickNode = this.imageList;
    this.inherited(arguments);
  },

  _handleClick : function(e) {
    var child = this.children[this.currentImageIndex];
    toura.app.Router.go(child.url);
  },

  _setCurrentImageIndexAttr : function(imageIndex) {
    this.inherited(arguments);

    dojo.forEach(this.indicator.childNodes, function(child) {
      dojo.removeClass(child, 'active');
    });
    dojo.addClass(this.indicator.childNodes[imageIndex], 'active');
  },

  onScrollEnd : function(imageIndex) {
    // stub for connection
  }
});
