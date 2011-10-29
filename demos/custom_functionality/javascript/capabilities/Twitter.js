dojo.provide('client.capabilities.Twitter');

toura.capability('Twitter', {
  requirements : {
    latestTweet   : 'custom.LatestTweet',
    map           : 'GoogleMap',
    userList      : 'custom.UserList',
    userInfo      : 'custom.UserInfo'
  },

  connects : [
    [ 'userList', 'onSelect', '_onUserSelect' ],
    [ 'map', 'onMapBuilt', '_onMapBuilt' ]
  ],

  init : function() {
    this.twitter = new client.data.Twitter();

    this.users = this.baseObj.getData('users').users;

    var user = this.users[0];

    this.latestTweet.set('loading', true);

    this.twitter.getLatest(user.twitter)
      .then(dojo.hitch(this.latestTweet, 'set', 'tweet'));

    this.userInfo.set('user', user);
  },

  _onMapBuilt : function() {
    this.map.set('center', this.users[0].location);
  },

  _onUserSelect : function(username) {
    this.twitter.getLatest(username).then(
      dojo.hitch(this.latestTweet, 'set', 'tweet')
    );

    var user = dojo.filter(this.users, function(u) {
      return u.twitter === username
    })[0];

    this.userInfo.set('user', user);
  }
});
