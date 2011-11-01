dojo.provide('client.components.LatestTweet');

mulberry.component('LatestTweet', {
  componentTemplate : dojo.cache('client.components', 'LatestTweet/LatestTweet.haml'),

  prep : function() {
    this.user = this.baseObj.getData('users').users[0];
  },

  _setTweetAttr : function(tweet) {
    tweet = tweet || {};
    this.set('loading', false);
    this.dateNode.innerHTML = tweet.date || '';
    this.tweetNode.innerHTML = tweet.text || 'error';
  }
});
