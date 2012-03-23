dojo.provide('mulberry.containers.Viewport');

dojo.require('mulberry._View');
dojo.require('mulberry.app.Config');

dojo.declare('mulberry.containers.Viewport', mulberry._View, {
  templateString : dojo.cache('mulberry.containers', 'Viewport/Viewport.haml'),

  direction : 'next',

  postCreate : function() {
    this.connect(this.domNode, 'webkitAnimationEnd', '_onAnimationEnd');
  },

  _setNavDirectionAttr : function(dir) {
    this.direction = dir === 'back' ? 'prev' : 'next';
  },

  _setContentAttr : function(newPage) {
    if (mulberry.animating) { return; }

    var n = this.domNode,
        next = this.direction === 'next';

    this.direction = 'next'; // reset
    this.currentPage = newPage;

    if (n.children.length) {
      mulberry.animating = true;
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
    mulberry.animating = false;
    dojo.publish('/page/transition/end');
    dojo.style(this.domNode, { width : mulberry.app.UI.viewport.width + 'px' });
  }
});
