dojo.require('client.components.LatestTweet');
dojo.require('client.components.UserList');
dojo.require('client.components.UserInfo');
dojo.require('client.components.Tweets');
dojo.require('client.capabilities.Twitter');
dojo.require('client.data.Twitter');

dojo.subscribe('/routes/loaded', function() {

  toura.app.Router.registerRoute('/twitter/:username', function(params) {
    var twitter = new client.data.Twitter(),
        page = toura.app.PageFactory.createPage({
          pageController : 'user',
          tweets : twitter.getAll(params.username),
          name : params.username
        });

    toura.app.UI.showPage(page);
  });

});
