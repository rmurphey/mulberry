dojo.provide('client.components.Tweets');

mulberry.component('Tweets', {
  componentTemplate : dojo.cache('client.components', 'Tweets/Tweets.haml'),
  tweetTemplate : mulberry.haml(dojo.cache('client.components', 'Tweets/Tweet.haml')),

  when : {
    tweets : function(data) {
      this.set('tweets', data);
    }
  },

  _setTweetsAttr : function(tweets) {
    this.populate(this.tweetTemplate, tweets);
  }
});
