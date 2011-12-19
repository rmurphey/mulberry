dojo.provide('toura.components.ImageCaption');

dojo.require('toura.components.BodyText');

dojo.declare('toura.components.ImageCaption', toura.components.BodyText, {
  "class" : 'image-caption',

  _getBodyText : function() {
    if (!this.node || !this.node.images) { return ''; }
    return this.node.images[0] ? (this.node.images[0].caption || '') : '';
  }
});
