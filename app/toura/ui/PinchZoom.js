dojo.provide('toura.ui.PinchZoom');

dojo.require('vendor.iscroll');

dojo.declare('toura.ui.PinchZoom', null, {
  zoomMax : 3,

  _makeScroller : function(listItem) {
    var self = this,
        bgImageWidget = dijit.byNode(listItem.firstChild);

    if (this.scroller) {
      this.scroller.destroy();
    }

    this.scroller = new iScroll(listItem, {
      zoom : toura.app.Has.iScrollZoom(),
      onZoomEnd : function() {
        self.onZoomEnd(bgImageWidget, this);
      },
      zoomMin : 0.33,
      zoomMax : this.zoomMax
    });
  },

  onZoomEnd : function(bgImageWidget, scroller) {
    if (this.zoomTimeout) { return; }

    this.zoomTimeout = setTimeout(dojo.hitch(this, function() {
      var scale = scroller.scale,
          oldWidth = dojo.style(bgImageWidget.domNode, 'width'),
          oldHeight = dojo.style(bgImageWidget.domNode, 'height'),
          newWidth = oldWidth * scale,
          newHeight = oldHeight * scale,
          newX = scroller.x,
          newY = scroller.y;

      if (bgImageWidget.imageWidth > bgImageWidget.imageHeight) {
        if (newWidth < toura.app.UI.viewport.width) {
          newWidth = toura.app.UI.viewport.width;
          newHeight = newWidth / ratio;
        }
      } else {
        if (newHeight < toura.app.UI.viewport.height) {
          newHeight = toura.app.UI.viewport.height;
          newWidth = newHeight * ratio;
        }
      }

      if (newWidth > toura.app.UI.viewport.width * this.zoomMax) {
        newWidth = oldWidth;
        newHeight = oldHeight;
        newX = newY = 0;
      }

      dojo.style(bgImageWidget.domNode, 'width', newWidth + 'px');
      dojo.style(bgImageWidget.domNode, 'height', newHeight + 'px');
      scroller.zoom(newX, newY, 1, 0);

      clearTimeout(this.zoomTimeout);
      this.zoomTimeout = null;
    }), 0);
  }

});

