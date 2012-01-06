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
     * looks at the object for a pageDef or pageController property, and uses
     * that property to determine how to set up the page.
     *
     * First, we determine the name of the controller we're going to use:
     *
     *    1. If the object does not have a pageDef or pageController property,
     *    then the pageDefName is set to 'default'
     *
     *    2. If the object has a pageDef or pageController property and the
     *    property's value is an object, then it is assumed the object has a
     *    'phone' and a 'tablet' property; the pageDefName is set to the value
     *    that corresponds with the device type.
     *
     * Once we have determined the proper page definition to use, we create an
     * instance of a Page using that definition, passing the Page instance the
     * data it will need. We return the Page instance, and createPage is
     * complete.
     */

    if (!obj) {
      throw new Error('toura.app.PageFactory::createPage requires an object');
    }

    var pageDefName = obj.pageDef || obj.pageController || 'default',
        pageDef;

    // allow setting different page controllers per device
    if (pageDefName && dojo.isObject(pageDefName)) {
      pageDefName = pageDefName[this.device.type] || 'default';
    } else {
      pageDefName = pageDefName || 'default';
    }

    pageDef = toura.pagedefs[pageDefName];

    if (!pageDef) {
      throw ('toura.app.PageFactory: The page definition "' + pageDefName + '" does not exist.');
    }

    toura.log('Creating ' + pageDefName);

    return new toura.containers.Page({
      baseObj: obj,
      device: this.device,
      pageDef: pageDef,
      pageDefName: pageDefName
    });
  }
});

dojo.subscribe('/app/ready', function() {
  toura.app.PageFactory = new toura.app.PageFactory(toura.app.Config.get('device'));
});

