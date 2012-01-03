dojo.provide('toura.ui.Scrollable');

dojo.require('dijit._Widget');
dojo.require('vendor.iscroll');

dojo.declare('toura.ui.Scrollable', dijit._Widget, {
  postCreate : function() {
    this.inherited(arguments);

    this.subscribe('/page/transition/end', '_makeScroller');
    this.subscribe('/window/resize', 'refreshScroller');
    this.subscribe('/fontsize', 'refreshScroller');
    this.subscribe('/content/update', function() {
      this.refreshScroller();
      if (this.scroller) {
        this.scroller.scrollTo(0, 0);
      }
    });

    dojo.addClass(this.domNode, 'scrollable');
  },

  _makeScroller : function() {
    if (this.domNode.children.length > 1) {
      console.error('toura.ui.Scrollable::_makeScroller: More than one child element. Only the first one will be scrollable. Probably not what you want!');
    }

    this.scroller = new iScroll(this.domNode, {
      vScrollbar: false
    });

    this.scroller.refresh();
  },

  makeScroller : function() {
    if (!this.scroller) {
      this._makeScroller();
    }
  },

  destroy : function() {
    if (this.scroller) {
      this.scroller.destroy();
    }
    this.inherited(arguments);
  },

  refreshScroller : function() {
    if (this.scroller) {
      this.scroller.refresh();
    }
  }
});

