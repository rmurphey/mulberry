dojo.provide('toura.components.AudioCaption');

dojo.require('toura._Component');
dojo.require('toura.components.BodyText');

dojo.declare('toura.components.AudioCaption', toura.components.BodyText, {
  "class" : 'audio-caption',

  _getBodyText : function() {
    if (!this.node || !this.node.audios) { return ''; }
    return this.node.audios[0] ? (this.node.audios[0].caption || '') : '';
  }
});

