dojo.provide('client.capabilities.Twitter');

mulberry.capability('Twitter', {
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
    this.users = this.baseObj.getData('users').users;
    this.twitter = new client.data.Twitter();

    var user = this.users[0];
    this.userInfo.set('user', user);
    this._loadUser(user);
  },

  _onMapBuilt : function() {
    this.map.set('center', this.users[0].location);
  },

  _onUserSelect : function(username) {
    var user = dojo.filter(this.users, function(u) {
      return u.twitter === username
    })[0];

    this._loadUser(user);
    this.map.set('center', user.location);
  },

  _loadUser : function(user) {
    var req = this.twitter.getLatest(user.twitter);
    req.then(dojo.hitch(this.latestTweet, 'set', 'tweet'));
    req.then(dojo.hitch(this, function(tweet) {
      user.bio = tweet.bio;
      this.userInfo.set('user', user);
    }));
  }
});
