dojo.provide('client.base');

dojo.require('client.components.Twitter');
dojo.require('client.components.HelloWorld')
dojo.require('client.components.PersistentComponent')

dojo.subscribe('/routes/loaded', function() {
  toura.app.Router.registerRoute(
    '/node/node-dynamic/:str',
    function(params) {
      var node = toura.app.Data.getModel('node-dynamic'),
          page = toura.app.PageFactory.createPage('node', node);

      toura.app.UI.showPage(page);
      page.init(params);
    }
  );
});

dojo.subscribe('/app/ready', function() {
  var h = new client.components.PersistentComponent();
  h.placeAt(dojo.body(), 'last');
  h.init();
});
