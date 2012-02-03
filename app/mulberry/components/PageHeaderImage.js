dojo.provide('mulberry.components.PageHeaderImage');

dojo.require('mulberry._Component');
dojo.require('mulberry.components.HeaderImage');

dojo.declare('mulberry.components.PageHeaderImage', mulberry.components.HeaderImage, {
  "class" : 'page-header-image',

  prepareData : function() {
    this.inherited(arguments);

    if (this.viewImage) {
      dojo.mixin(this.viewImage, this._calculateDimensions());
    }
  },

  _getWidth : function() {
    return mulberry.app.UI.viewport.width;
  }
});
