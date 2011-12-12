dojo.provide('client.routes');

mulberry.route('/node/node-dynamic/:str', function(params) {
  var node = toura.app.Data.getModel('node-dynamic'),
      page = toura.app.PageFactory.createPage('node', node);

  toura.app.UI.showPage(page);
  page.init(params);
});
