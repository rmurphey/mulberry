dojo.provide('toura.ui.BackgroundImage');

dojo.require('dijit._Widget');

dojo.declare('toura.ui.BackgroundImage', dijit._Widget, {
  // These attributes must be present on the dom element
  imageUrl : '',

  isLoaded : false,
  loadOnInit : false,

  postCreate : function() {
    this.inherited(arguments);

    if (this.loadOnInit) {
      this.loadImage();
    }
  },

  loadImage : function() {
    if (this.isLoaded) { return; }

    dojo.style(this.domNode, {
      'backgroundImage': 'url(' + this.imageUrl + ')',
      'backgroundRepeat': 'no-repeat'
    });

    this.isLoaded = true;
  },

  unloadImage : function() {
    dojo.style(this.domNode, 'backgroundImage', null);
    this.isLoaded = false;
  },

  _setBackgroundImageAttr : function(imageProps) {
    if (!imageProps) { return; }

   this.imageUrl = imageProps.url;
  }

});

