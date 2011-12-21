dojo.provide('toura.containers.Viewport');

dojo.require('toura._View');
dojo.require('toura.app.Config');

dojo.declare('toura.containers.Viewport', [ toura._View ], {
  templateString : dojo.cache('toura.containers', 'Viewport/Viewport.haml'),

  direction : 'next',

  postCreate : function() {
    this.connect(this.domNode, 'webkitAnimationEnd', '_onAnimationEnd');
  },

  _setNavDirectionAttr : function(dir) {
    this.direction = dir === 'back' ? 'prev' : 'next';
  },

  _setContentAttr : function(newPage) {
    if (toura.animating) { return; }

    var n = this.domNode,
        next = this.direction === 'next';

    this.direction = 'next'; // reset
    this.currentPage = newPage;

    if (n.children.length) {
      toura.animating = true;
      this.addClass('pre-slide');
      newPage.placeAt(n, next ? 'last' : 'first');
      this.addClass(next ? 'slide-left' : 'slide-right');
    } else {
      newPage.placeAt(n, 'last');
      this._onAnimationEnd();
    }

    setTimeout(function() {
      // sometimes webkitAnimationEnd doesn't fire :/
      if (this.animating) {
        this._onAnimationEnd();
      }
    }, 600);
  },

  _cleanupOldPage : function() {
    var pages = document.querySelectorAll('ol.viewport > li');

    dojo.forEach(pages, function(page) {
      if (this.currentPage.domNode !== page) {
        dojo.destroy(page);

        var widget = dijit.byNode(page);

        if (widget) { widget.destroy(); }
      }
    }, this);

    this.removeClass(['slide-left', 'slide-right', 'pre-slide']);
  },

  _onAnimationEnd : function() {
    this._cleanupOldPage();
    toura.animating = false;
    dojo.publish('/page/transition/end');
  }
});
