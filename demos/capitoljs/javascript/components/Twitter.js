dojo.provide('client.components.Twitter');

mulberry.component('Twitter', {
  componentTemplate : dojo.cache('client.components', 'Twitter/Twitter.haml'),
  tweetTemplate : dojo.cache('client.components', 'Twitter/Tweet.haml'),

  init : function() {
    var data = this.baseObj.getData('twitter');

    $.ajax('http://search.twitter.com/search.json?q=' + data.term, {
      dataType : 'jsonp',
      success : $.proxy(this, '_onLoad')
    });
  },

  _onLoad : function(data) {
    var tweets = data.results,
        tpl = mulberry.haml(this.tweetTemplate),
        html = $.map(tweets, function(tweet) {
          tweet.link = 'http://twitter.com/capitoljs/status/' + tweet.id_str;

          tweet.created_at = dojo.date.locale.format(
            new Date(tweet.created_at), {
              datePattern : 'EEE',
              timePattern : 'h:mm a'
            }
          );

          tweet.text = tweet.text.replace(
            /@(\S+)/g,
            "<a href='http://twitter.com/#!/$1'>@$1</a>"
          );

          return tpl(tweet);
        }).join('');

    this.$domNode.html(html);
    this.region.refreshScroller();
  }
});
