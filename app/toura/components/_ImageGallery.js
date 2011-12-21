dojo.provide('toura.components._ImageGallery');

dojo.require('toura.ui.BackgroundImage');

/**
 * This is a mixin to be used with components that include
 * a set of images. It should not be used on its own.
 */
dojo.declare('toura.components._ImageGallery', null, {
  widgetsInTemplate : true,

  postCreate : function() {
    this.inherited(arguments);
  },

  startup : function() {
    this._setWidth();
    this._setupClick();
    this.subscribe('/window/resize', '_setWidth');
  },

  _setWidth : function() {
    // TODO: get list items from dom instead of depending on class name
    this.widthItems = this.widthItems || this.query('.image');
    this.widthItems.style('width', toura.app.UI.viewport.width + 'px');
  },

  _setCurrentImageIndexAttr : function(imageIndex) {
    this.bgImgs = this.bgImgs || dojo.filter(dijit.findWidgets(this.domNode), function(w) {
      return w.isInstanceOf(toura.ui.BackgroundImage);
    });

    dojo.forEach(this.bgImgs, function(bgImg, i) {
      if (imageIndex !== null && i >= imageIndex - 1 && i <= imageIndex + 1) {
        bgImg.loadImage();
      } else {
        bgImg.unloadImage();
      }
    }, this);

    this.currentImageIndex = imageIndex;
  },

  _setupClick : function() {
    if (!this._handleClick) { return; }
    if (!this.clickNode) { return; }

    var events = toura.app.UI.hasTouch ? {
      start : 'touchstart',
      move : 'touchmove',
      end : 'touchend'
    } : {
      start : 'mousedown',
      move : 'mousemove',
      end : 'mouseup'
    };

    this.connect(this.clickNode, events.start, function() {
      var c = [],
          moved,
          handle = dojo.hitch(this, '_handleClick'),
          start = new Date().getTime();

      c.push(dojo.connect(this.imageList, events.move, function() {
        moved = true;
      }));

      c.push(dojo.connect(this.imageList, events.end, function(e) {
        dojo.forEach(c, dojo.disconnect);
        if ((new Date().getTime() - start > toura.app.UI.touchMoveDebounce) && moved) { return; }
        handle(e);
      }));
    });
  }

});
