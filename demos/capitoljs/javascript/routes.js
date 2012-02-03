dojo.provide('client.routes');

mulberry.route('/node/node-dynamic/:str', function(params) {
  var node = mulberry.app.Data.getModel('node-dynamic'),
      page = mulberry.app.PageFactory.createPage('node', node);

  mulberry.app.UI.showPage(page);
  page.init(params);
});
