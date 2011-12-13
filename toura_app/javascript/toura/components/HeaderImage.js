dojo.provide('toura.components.HeaderImage');

dojo.require('toura._Component');

dojo.declare('toura.components.HeaderImage', toura._Component, {
  templateString : dojo.cache('toura.components', 'HeaderImage/HeaderImage.haml'),

  prepareData : function() {
    this.inherited(arguments);

    var deviceType = this.device.type,
        imageType = this.phone ? 'gallery' : 'original';

    if (this.node.headerImage && this.node.headerImage[deviceType]) {
      this.image = this.node.headerImage[deviceType][imageType];

      // create a fresh object
      this.viewImage = dojo.mixin({}, this.image);
    } else {
      this.viewImage = false;
    }
  },

  setupConnections : function() {
    if (!this.image) { return; }

    var origImage = this.node.headerImage[this.device.type];

    if (origImage.destination) {
      this.connect(this.domNode, 'click', function() {
        toura.app.PhoneGap.browser.url(origImage.destination);
      });
    }
  },

  setupSubscriptions : function() {
    this.subscribe('/window/resize', '_resizeImage');
  },

  teardown : function() {
    dojo.destroy(this.domNode);
  },

  resizeElements : function() {
    if (!this.viewImage) {
      this.destroy();
      return;
    }

    this._resizeImage();
  },

  _resizeImage : function() {
    if (!this.imageNode) { return; }
    dojo.attr(this.imageNode, this._calculateDimensions());
  },

  _calculateDimensions : function() {
    var w = this._getWidth(),
        img = this.image;

    return {
      width : img ? w : 0,
      height : img ? Math.ceil(img.height * (w / img.width)) : 0
    };
  },

  _getWidth : function() {
    return this.getDimensions().width;
  }
});

