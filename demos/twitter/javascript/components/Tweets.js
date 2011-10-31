dojo.provide('client.components.Tweets');

mulberry.component('Tweets', {
  componentTemplate : dojo.cache('client.components', 'Tweets/Tweets.haml'),
  tweetTemplate : mulberry.haml(dojo.cache('client.components', 'Tweets/Tweet.haml')),

  init : function() {
    this.baseObj.tweets.then(dojo.hitch(this, 'set', 'tweets'));
  },

  _setTweetsAttr : function(tweets) {
    mulberry.populate(this.domNode, this.tweetTemplate, tweets);
  }
});
