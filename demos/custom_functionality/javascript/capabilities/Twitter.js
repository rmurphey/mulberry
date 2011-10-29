dojo.provide('client.capabilities.Twitter');

toura.capability('Twitter', {
  requirements : {
    latestTweet   : 'custom.LatestTweet',
    map           : 'GoogleMap',
    userList      : 'custom.UserList'
  },

  connects : [
    [ 'userList', 'onSelect', '_onUserSelect' ],
    [ 'map', 'onMapBuilt', '_onMapBuilt' ]
  ],

  init : function() {
    this.twitter = new client.data.Twitter();

    this.users = this.baseObj.getData('users').users;

    this.latestTweet.set('loading', true);

    this.twitter.get(this.users[0].twitter)
      .then(dojo.hitch(this.latestTweet, 'set', 'tweet'));
  },

  _onMapBuilt : function() {
    this.map.set('center', this.users[0].location);
  },

  _onUserSelect : function(username) {
    this.twitter.get(username).then(
      dojo.hitch(this.latestTweet, 'set', 'tweet')
    );

    var user = dojo.filter(this.users, function(u) {
      return u.twitter === username
    })[0];

    this.userInfo.set('user', user);
  }
});
