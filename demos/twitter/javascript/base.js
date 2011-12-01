dojo.require('client.components.LatestTweet');
dojo.require('client.components.UserList');
dojo.require('client.components.UserInfo');
dojo.require('client.components.Tweets');
dojo.require('client.capabilities.Twitter');
dojo.require('client.stores.Twitter');

mulberry.route('/twitter/:username', function(params) {
  var twitter = new client.stores.Twitter(),
      page = mulberry.app.PageFactory.createPage({
        pageController : 'user',
        tweets : twitter.getAll(params.username),
        name : params.username
      });

  mulberry.app.UI.showPage(page);
});
