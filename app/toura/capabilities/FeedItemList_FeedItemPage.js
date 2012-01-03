dojo.provide('toura.capabilities.FeedItemList_FeedItemPage');

dojo.require('toura._Capability');

dojo.declare('toura.capabilities.FeedItemList_FeedItemPage', [ toura._Capability ], {
  requirements : {
    feedItemList : 'FeedItemList'
  },

  connects : [
    [ 'feedItemList', 'onSelect', '_navigateToFeedItemPage' ]
  ],

  _navigateToFeedItemPage : function(feedId, itemIndex) {
    var url = toura.app.URL.feedItem(feedId, itemIndex);
    toura.app.Router.go(url);
  }
});

