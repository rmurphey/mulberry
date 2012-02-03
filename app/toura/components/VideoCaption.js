dojo.provide('toura.components.VideoCaption');

dojo.require('toura.components._MediaCaption');

dojo.declare('toura.components.VideoCaption', toura.components._MediaCaption, {
  "class" : 'video-caption',

  _getBodyText : function() {
    if (!this.node || !this.node.videos) { return ''; }
    return this.node.videos[0] ? (this.node.videos[0].caption || '') : '';
  }
});


