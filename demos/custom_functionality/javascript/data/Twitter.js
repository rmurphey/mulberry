dojo.provide('client.data.Twitter');

dojo.declare('client.data.Twitter', null, {
  getLatest : function(username) {
    console.log('GETTING LATEST', username);
    return this._get(username, 1).then(dojo.hitch(this, '_getLatest'));
  },

  getAll : function(username) {
    return this._get(username, 10).then(dojo.hitch(this, '_getAll'));
  },

  _get : function(username, count) {
    var url = 'http://twitter.com/status/user_timeline/${username}.json?count=' + (count || 10);

    return dojo.io.script.get({
      url : toura.tmpl(url, { username : username }),
      callbackParamName : 'callback'
    });
  },

  _getLatest : function(data) {
    console.log('DATA', data);
    if (!data || !data.length) { return false; }
    return this._formatTweet(data[0]);
  },

  _getAll : function(data) {
    return dojo.map(data, this._formatTweet);
  },

  _formatTweet : function(tweet) {
    return {
      text : tweet.text,
      date : dojo.date.locale.format(new Date(tweet.created_at)),
      bio : tweet.user.description
    };
  }
});
