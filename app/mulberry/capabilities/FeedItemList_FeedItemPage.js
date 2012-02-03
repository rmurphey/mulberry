dojo.provide('mulberry.capabilities.FeedItemList_FeedItemPage');

dojo.require('mulberry._Capability');

dojo.declare('mulberry.capabilities.FeedItemList_FeedItemPage', [ mulberry._Capability ], {
  requirements : {
    feedItemList : 'FeedItemList'
  },

  connects : [
    [ 'feedItemList', 'onSelect', '_navigateToFeedItemPage' ]
  ],

  _navigateToFeedItemPage : function(feedId, itemIndex) {
    var url = mulberry.app.URL.feedItem(feedId, itemIndex);
    mulberry.app.Router.go(url);
  }
});

