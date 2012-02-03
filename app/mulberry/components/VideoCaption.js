dojo.provide('mulberry.components.VideoCaption');

dojo.require('mulberry.components._MediaCaption');

dojo.declare('mulberry.components.VideoCaption', mulberry.components._MediaCaption, {
  "class" : 'video-caption',

  _getBodyText : function() {
    if (!this.node || !this.node.videos) { return ''; }
    return this.node.videos[0] ? (this.node.videos[0].caption || '') : '';
  }
});


