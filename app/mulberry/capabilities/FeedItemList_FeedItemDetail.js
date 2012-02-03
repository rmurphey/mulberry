dojo.provide('mulberry.capabilities.FeedItemList_FeedItemDetail');

dojo.require('mulberry._Capability');

dojo.declare('mulberry.capabilities.FeedItemList_FeedItemDetail', [ mulberry._Capability ], {
  requirements : {
    feedItemList : 'FeedItemList',
    feedItemDetail : 'FeedItemDetail'
  },

  connects : [
    [ 'feedItemList', 'onSelect', '_showFeedItem' ],
    [ 'feedItemList', 'onPopulate', '_showFirstItem' ]
  ],

  _showFeedItem : function(feedId, itemIndex) {
    this.feedItemDetail.set('item', this.feedItemList.feed.getItem(itemIndex));
  },

  _showFirstItem : function() {
    this.feedItemDetail.set('item', this.feedItemList.feed.getItem(0));
  }
});

