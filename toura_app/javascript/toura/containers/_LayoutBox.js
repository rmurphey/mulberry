dojo.provide('toura.containers._LayoutBox');

dojo.require('toura._View');
dojo.require('toura.ui.BackgroundImage');

dojo.declare('toura.containers._LayoutBox', [ toura._View, toura.ui.BackgroundImage ], {
  templateString : '<div class=layout-box></div>',

  defaultConfig : {
    containerType : 'row', // row || columns || component
    layout : 'normal', // normal | overlay
    size : 'flex', // flex || fixed || full
    scrollable : false
  },

  postMixInProperties : function() {
    // use the default config, but override with any settings that get passed in
    this.config = dojo.mixin(dojo.mixin({}, this.defaultConfig), this.config);
  },

  postCreate : function() {
    this.inherited(arguments);

    var classNames = [
      this.config.containerType + '-container',
      'size-' + this.config.size,
      'layout-' + this.config.layout
    ];

    if (this.config.className) {
      classNames.push(this.config.className);
    }

    this.addClass(classNames);

    if (this.config.backgroundImage && this.backgroundImage) {
      this.loadImage();
    }
  }

});

