dojo.provide('mulberry.components.PinCaption');

dojo.require('mulberry._Component');
dojo.require('mulberry.components.BodyText');

dojo.declare('mulberry.components.PinCaption', mulberry.components.BodyText, {
  "class" : 'pin-caption',

  _getBodyText : function() {
    return this.caption || this.inherited(arguments);
  }
});

