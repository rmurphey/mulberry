dojo.provide('toura.components.PageHeaderImage');

dojo.require('toura._Component');
dojo.require('toura.components.HeaderImage');

dojo.declare('toura.components.PageHeaderImage', toura.components.HeaderImage, {
  "class" : 'page-header-image',

  prepareData : function() {
    this.inherited(arguments);

    if (this.viewImage) {
      dojo.mixin(this.viewImage, this._calculateDimensions());
    }
  },

  _getWidth : function() {
    return toura.app.UI.viewport.width;
  }
});
