dojo.provide('toura.components.PinCaption');

dojo.require('toura._Component');
dojo.require('toura.components.BodyText');

dojo.declare('toura.components.PinCaption', toura.components.BodyText, {
  "class" : 'pin-caption',

  _getBodyText : function() {
    return this.caption || this.inherited(arguments);
  }
});

