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
     * looks at the object for a pageDef property, and uses that property to
     * determine how to set up the page.
     *
     * Once we have determined the proper page definition to use, we create an
     * instance of a Page using that definition, passing the Page instance the
     * data it will need. We return the Page instance, and createPage is
     * complete.
     */

    if (!obj) {
      throw new Error('toura.app.PageFactory::createPage requires an object');
    }

    var pageDefName = obj.pageDef || 'default',
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
  toura.createPage = dojo.hitch(toura.app.PageFactory, 'createPage');
});

