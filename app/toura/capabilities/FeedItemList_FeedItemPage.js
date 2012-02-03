dojo.provide('toura.capabilities.FeedItemList_FeedItemPage');

dojo.require('mulberry._Capability');

dojo.declare('toura.capabilities.FeedItemList_FeedItemPage', mulberry._Capability, {
  requirements : {
    feedItemList : 'FeedItemList'
  },

  connects : [
    [ 'feedItemList', 'onSelect', '_navigateToFeedItemPage' ]
  ],

  _navigateToFeedItemPage : function(feedId, itemIndex) {
    var url = toura.URL.feedItem(feedId, itemIndex);
    mulberry.app.Router.go(url);
  }
});

