dojo.provide('toura.components.buttons.FontSize');

dojo.require('toura.components.buttons._Button');

dojo.declare('toura.components.buttons.FontSize', toura.components.buttons._Button, {
  sizes : [
    'small',
    'medium',
    'large'
  ],

  "class" : 'font-size',

  defaultSize : 'medium',
  sizePrefix : 'font-size-',

  onClick : function(e) {
    e.preventDefault();

    var b = dojo.body(),
        currentSize = toura.app.UI.fontSize || (this.sizePrefix + this.defaultSize),
        currentSizeIndex = dojo.indexOf(this.sizes, currentSize.replace(this.sizePrefix, '')),
        newSize = this.sizePrefix + (this.sizes[ currentSizeIndex + 1 ] || this.sizes[0]);

    toura.app.UI.set('fontSize', newSize);
  },

  initializeStrings : function() {
    this.i18n_font = this.getString('FONT');
  }

});
