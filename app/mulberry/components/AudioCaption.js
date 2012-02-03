dojo.provide('mulberry.components.AudioCaption');

dojo.require('mulberry._Component');
dojo.require('mulberry.components.BodyText');

dojo.declare('mulberry.components.AudioCaption', mulberry.components.BodyText, {
  "class" : 'audio-caption',

  _getBodyText : function() {
    if (!this.node || !this.node.audios) { return ''; }
    return this.node.audios[0] ? (this.node.audios[0].caption || '') : '';
  }
});

