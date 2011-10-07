dojo.provide('toura.containers.Pages');

dojo.require('toura._View');
dojo.require('toura.app.Config');

dojo.declare('toura.containers.Pages', [ toura._View ], {
  templateString : dojo.cache('toura.containers', 'Pages/Pages.haml'),

  direction : 'next',

  postCreate : function() {
    this.connect(this.domNode, 'webkitAnimationEnd', function() {
      this._onAnimationEnd();
      this._cleanupOldPage();
    });
  },

  _setNavDirectionAttr : function(dir) {
    this.direction = dir === 'back' ? 'prev' : 'next';
  },

  _setContentAttr : function(newPage) {
    if (toura.animating) { return; }

    var n = this.domNode,
        next = this.direction === 'next';

    this.direction = 'next'; // reset

    if (this.oldPage) {
      toura.animating = true;
      this.addClass('pre-slide');
      newPage.placeAt(n, next ? 'last' : 'first');

      this.pageToDestroy = this.oldPage;
      this.addClass(next ? 'slide-left' : 'slide-right');
    } else {
      newPage.placeAt(n, 'last');
      this._onAnimationEnd();
    }

    this.oldPage = newPage;
  },

  _cleanupOldPage : function() {
    if (this.pageToDestroy && this.pageToDestroy.destroy) {
      this.pageToDestroy.destroy();
    }

    this.removeClass(['slide-left', 'slide-right', 'pre-slide']);
  },

  _onAnimationEnd : function() {
    toura.animating = false;
    dojo.publish('/page/transition/end');
  }
});
