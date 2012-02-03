dojo.provide('mulberry.components.ImageCaption');

dojo.require('mulberry.components._MediaCaption');

dojo.declare('mulberry.components.ImageCaption', mulberry.components._MediaCaption, {
  "class" : 'image-caption',

  _getBodyText : function() {
    if (!this.node || !this.node.images) { return ''; }
    return this.node.images[0] ? (this.node.images[0].caption || '') : '';
  }
});
