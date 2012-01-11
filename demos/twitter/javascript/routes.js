dojo.provide('client.routes');

mulberry.route('/twitter/:username', function(params) {
  var twitter = client.stores.Twitter,
      page = mulberry.app.PageFactory.createPage({
        pageDef : 'user',
        tweets : twitter.getAll(params.username),
        name : params.username
      });

  mulberry.app.UI.showPage(page);
});
