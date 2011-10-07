# Capabilities

Capabilities describe interactions between components on a page, or between the
page and a component. For example, a capability might describe how a caption
component should be updated when a user swipes to a new image in an image
gallery.

To add a capability to a custom page template, specify the capability's name
and the involved component(s) in the template definition. Note that each
involved component should be prefixed by the name of the screen on which it
appears -- this allows the same component to be used on multiple screens
without confusion.

    ImageGallery
      screens:
        -
          name: index
          regions:
            -
              size: fixed
              scrollable: false
              components:
                - PageNav
            -
              size: flex
              scrollable: true
              components:
                - ImageGallery
                - ImageCaption
        capabilities:
          -
            name: Gallery_Caption
            components:
              - index:ImageGallery
              - index:ImageCaption

## Creating Capabilities
Once you specify that a page template has a capability, you must define the
capability. A capability definition specifies the components that are required
for the capability, and specifies how to react when certain events occur:

    toura.capability('Gallery_Caption', {
      requirements : {
        imageGallery : 'ImageGallery',
        imageCaption : 'ImageCaption'
      },

      connects : [
        // Read this as: "When the imageGallery instance's onScrollEnd
        // event fires, call the _setCaption method of the capability"
        [ 'imageGallery', 'onScrollEnd', '_setCaption' ]
      ],

      _setCaption : function(imageIndex) {
        var image = this.node.images[imageIndex];

        // Capabilities automatically get access to the components that
        // were specified in the requirements object; so, here,
        // this.imageCaption refers to the ImageCaption component
        // associated with the capability
        this.imageCaption.set('content', image && image.caption || '');
      }
    });
