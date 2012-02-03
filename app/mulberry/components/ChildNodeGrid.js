dojo.provide('mulberry.components.ChildNodeGrid');

dojo.require('mulberry._Component');

dojo.declare('mulberry.components.ChildNodeGrid', mulberry._Component, {
  templateString : dojo.cache('mulberry.components', 'ChildNodeGrid/ChildNodeGrid.haml'),
  widgetsInTemplate : true,

  prepareData : function() {
    this.node.populateChildren();
    // TODO: MAP should enforce this restraint
    this.children = dojo.filter(this.node.children || [], function(child) {
      return child.featuredImage !== undefined;
    });

    if (this.tablet) {
      var num = this.children.length,
          size = num > 11 ? 'medium' : 'large';

      this['class'] = 'size-' + size;
    }

    if (this.device.os === 'ios') { return ; }

    if (mulberry.components.ChildNodeGrid.placedCSS) { return; }

    var tpl = dojo.cache('mulberry.components.ChildNodeGrid', 'child-node-grid.css.tpl'),
        aspectRatio = 3/4,
        width = Math.floor(mulberry.app.UI.viewport.width / 2 - 18),
        height = Math.floor(width * aspectRatio * 1.40),
        imageHeight = width * aspectRatio,
        css = dojo.string.substitute(tpl, {
          width : width,
          height : height,
          imageHeight : imageHeight
        });

    dojo.place(css, document.querySelector('head'));
    mulberry.components.ChildNodeGrid.placedCSS = true;
  }
});
