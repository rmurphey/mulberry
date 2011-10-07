dojo.provide('toura.pageControllers.node._ImageGalleryPage');

dojo.declare('toura.pageControllers.node._ImageGalleryPage', [], {
  /**
   * This is a mixin to give common image gallery behavior
   * to a page controller. It should not be used on its own.
   */
  _imageGalleryPageSetup : function(config) {
    var caption = config.caption,
        fullScreen = config.fullScreen,
        gallery = config.gallery,
        setCaption = function(image) {
          if (!caption) { return; }
          caption.set('content', image && image.caption || '');

          // this is to make the scroller reveal all the content. there's
          // probably a better way to do this.
          dojo.style(caption.domNode, 'height', null);
          dojo.style(caption.domNode, 'height', (caption.domNode.clientHeight + 50) + 'px');
        };

    this.connect(gallery, 'onShowDetail', function(imageIndex) {
      fullScreen.set('active', true);
      fullScreen.set('currentImageIndex', imageIndex);

      dojo.publish('/ImageGalleryPage/detail/show');
      toura.app.UI.set('siblingNavVisible', false);
      dojo.addClass(this.mainScreen, 'hidden');
    });

    this.connect(fullScreen, 'onHideDetail', function(imageIndex) {
      var image = this.node.images[imageIndex];

      gallery.set('active', true);
      gallery.scrollToIndex(imageIndex);
      setCaption(image);

      dojo.publish('/ImageGalleryPage/detail/hide');
      toura.app.UI.set('siblingNavVisible', true);
      dojo.removeClass(this.mainScreen, 'hidden');
    });

    this.connect(this, 'init', function(pageState) {
      this.connect(gallery, 'onScrollEnd', function(imageIndex) {
        var image = this.node.images[imageIndex];
        setCaption(image);
        dojo.publish('/content/update');
      });

      if (!pageState || !pageState.assetId) { return; }

      var imageId = pageState.assetId,
          index;

      if (!imageId) { return; }

      var image = dojo.filter(this.node.images, function(image, i) {
        if (image.id === imageId) {
          index = i;
          return image;
        }
      })[0];

      if (!image) { return; }

      this.connect(gallery, 'onScrollerSetupComplete', function() {
        setTimeout(function() {
          gallery.scrollToIndex(index);
          setCaption(image);
        }, 100);
      });
    });
  }
});

