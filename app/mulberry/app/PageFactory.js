dojo.provide('mulberry.app.PageFactory');

dojo.require('mulberry.Device');
dojo.require('mulberry.containers.Page');

dojo.declare('mulberry.app.PageFactory', null, {
  constructor: function(device) {
    this.device = device;
  },

  createPage: function(obj) {
    /*
     * createPage receives an object that it will use to create a page. It
     * looks at the object for a pageDef property, and uses that property to
     * determine how to set up the page.
     *
     * Once we have determined the proper page definition to use, we create an
     * instance of a Page using that definition, passing the Page instance the
     * data it will need. We return the Page instance, and createPage is
     * complete.
     */

    if (!obj) {
      throw new Error('mulberry.app.PageFactory::createPage requires an object');
    }

    var pageDefName = obj.pageDef || 'default',
        pageDef = mulberry.pageDefs[pageDefName];

    if (!pageDef) {
      throw ('mulberry.app.PageFactory: The page definition "' + pageDefName + '" does not exist.');
    }

    mulberry.log('Creating ' + pageDefName);

    return new mulberry.containers.Page({
      baseObj: obj,
      device: this.device,
      pageDef: pageDef,
      pageDefName: pageDefName
    });
  }
});

dojo.subscribe('/app/ready', function() {
  mulberry.app.PageFactory = new mulberry.app.PageFactory(mulberry.Device);
  mulberry.createPage = dojo.hitch(mulberry.app.PageFactory, 'createPage');
});

