dojo.provide('toura.components._MediaCaption');

dojo.require('toura.components.BodyText');

dojo.declare('toura.components._MediaCaption', toura.components.BodyText, {

  _fixCaptionAlignment: function() {
    // by default, the domNode should span the full width, as it's a block
    // element
    
    // this value could be cached, but we'd then need separate functions for
    // /content/update and /window/resize
    var fullwidth = dojo.position(this.domNode).w,
        textwidth;

    // we add float:left so this will carry a width determined by its content
    // rather than the window
    dojo.style(this.domNode, { 'float' : 'left' });
    
    textwidth = dojo.position(this.domNode).w;
    if (fullwidth > textwidth) {
      dojo.addClass(this.domNode, 'caption-center');
    } else {
      dojo.removeClass(this.domNode, 'caption-center');
    }
    
    // remove the float, since it's no longer needed
    dojo.style(this.domNode, { float: '' });
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
