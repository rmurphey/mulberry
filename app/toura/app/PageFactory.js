dojo.provide('toura.app.PageFactory');

dojo.require('toura.app.Config');
dojo.require('toura.containers.Page');

dojo.declare('toura.app.PageFactory', null, {
  constructor: function(device) {
    this.device = device;
  },

  createPage: function(obj) {
    /*
     * createPage receives an object that it will use to create a page. It
     * looks at the object for a pageController property, and uses that
     * pageController property to determine how to set up the page controller
     * for the page. The process for determining this is a bit convoluted for
     * the time being, in order to support some legacy systems. Here's how it
     * works:
     *
     * First, we determine the name of the controller we're going to use:
     *
     *    1. If the object does not have a pageController property, then the
     *    controllerName is set to 'default'
     *
     *    2. If the object has a pageController property and the property's
     *    value is an object, then it is assumed the object has a 'phone' and
     *    a 'tablet' property; the controllerName is set to the value that
     *    corresponds with the device type.
     *
     * Once we have determined the proper page controller to use, we create an
     * instance of that controller, passing it the data it will need in order
     * to create the page. We return the controller instance, and createPage is
     * complete.
     */

    if (!obj) {
      throw new Error('toura.app.PageFactory::createPage requires an object');
    }

    var controllerName = obj.pageController || 'default',
    config;

    // allow setting different page controllers per device
    if (obj.pageController && dojo.isObject(obj.pageController)) {
      controllerName = obj.pageController[this.device.type] || 'default';
    } else {
      controllerName = obj.pageController || 'default';
    }

    config = toura.templates[controllerName];

    if (!config) {
      console.error('toura.app.PageFactory: The controller "' + controllerName + '" does not exist. Did you require it in PageFactory?');
      throw ('toura.app.PageFactory: The controller "' + controllerName + '" does not exist. Did you require it in PageFactory?');
    }

    toura.log('Creating ' + controllerName);

    return new toura.containers.Page({
      baseObj: obj,
      device: this.device,
      templateConfig: config,
      templateName: controllerName
    });
  }
});

dojo.subscribe('/app/ready', function() {
  toura.app.PageFactory = new toura.app.PageFactory(toura.app.Config.get('device'));
});

