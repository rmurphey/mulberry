dojo.provide('toura.components._MediaCaption');

dojo.require('toura.components.BodyText');

dojo.declare('toura.components._MediaCaption', toura.components.BodyText, {

  _fixCaptionAlignment: function() {
    // by default, the domNode should span the full width, as it's a block
    // element
    var fullWidth = dojo.position(this.domNode).w,
        textWidth;

    // we add float:left so this will carry a width determined by its content
    // rather than the window
    dojo.style(this.domNode, { 'float' : 'left' });
    
    textWidth = dojo.position(this.domNode).w;
    if (fullWidth > textWidth) {
      this.addClass('short-caption');
    } else {
      this.removeClass('short-caption');
    }
    
    // remove the float, since it's no longer needed
    dojo.style(this.domNode, { 'float' : '' });
  },
  
  resizeElements: function() {
    this.inherited(arguments);
    this._fixCaptionAlignment();
  },
  
  setupSubscriptions: function() {
    this.subscribe('/content/update', '_fixCaptionAlignment');
    this.subscribe('/window/resize',  '_fixCaptionAlignment');
  }
});
