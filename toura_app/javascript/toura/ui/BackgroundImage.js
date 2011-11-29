dojo.provide('toura.ui.BackgroundImage');

dojo.require('dijit._Widget');

dojo.declare('toura.ui.BackgroundImage', dijit._Widget, {
  // These attributes must be present on the dom element
  imageUrl : '',
  imageHeight : '',
  imageWidth : '',

  resizeMethod : 'contain',
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

    if (!toura.app.Has.cssBackgroundContain()) {
      this._resizeImage();

      this.subscription = this.subscription || dojo.subscribe('/window/resize', this, function() {
        this._resizeImage();
      });
    }

    this.isLoaded = true;
  },

  unloadImage : function() {
    dojo.style(this.domNode, 'backgroundImage', null);
    this.isLoaded = false;
    if (this.subscription) {
      dojo.unsubscribe(this.subscription);
    }
  },

  _setBackgroundImageAttr : function(imageProps) {
    if (!imageProps) { return; }

    dojo.mixin(this, {
      imageUrl : imageProps.url,
      imageWidth : imageProps.width,
      imageHeight : imageProps.height
    });
  },

  _resizeImage : function() {
    var areaDimensions = this._getDimensions(),
      imgDimensions = {
        width: this.imageWidth,
        height: this.imageHeight
      },
      newDimensions = this._calculateDimensions(areaDimensions, imgDimensions);

    dojo.style(this.domNode, 'webkitBackgroundSize', newDimensions.width + 'px ' + newDimensions.height + 'px');
  },

  _calculateDimensions : function(areaDimensions, imageDimensions) {
    var imageRatio = imageDimensions.width/imageDimensions.height,
        areaRatio = areaDimensions.width/areaDimensions.height;

    if (this.resizeMethod === 'contain') {
      if (imageRatio < areaRatio) {
        return this._fitToHeight(areaDimensions, imageDimensions);
      } else {
        return this._fitToWidth(areaDimensions, imageDimensions);
      }
    } else { // resizeMethod === 'cover'
      if (imageRatio < areaRatio) {
        return this._fitToWidth(areaDimensions, imageDimensions);
      } else {
        return this._fitToHeight(areaDimensions, imageDimensions);
      }
    }
  },

  _fitToWidth : function(areaDimensions, imageDimensions) {
    return {
      width : areaDimensions.width,
      height :  Math.ceil(imageDimensions.height * (areaDimensions.width / imageDimensions.width))
    };
  },

  _fitToHeight : function(areaDimensions, imageDimensions) {
    return {
      width : Math.ceil(imageDimensions.width * (areaDimensions.height / imageDimensions.height)),
      height : areaDimensions.height
    };
  },

  _getDimensions : function() {
    this.dimensions = this.dimensions || {
      width: dojo.style(this.domNode, 'width'),
      height: dojo.style(this.domNode, 'height')
    };

    return this.dimensions;
  },

  destroy : function() {
    this.inherited(arguments);
    if (this.subscription) {
      dojo.unsubscribe(this.subscription);
    }
  }

});

