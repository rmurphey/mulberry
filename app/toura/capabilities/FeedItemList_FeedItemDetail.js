dojo.provide('toura.capabilities.FeedItemList_FeedItemDetail');

dojo.require('toura._Capability');

dojo.declare('toura.capabilities.FeedItemList_FeedItemDetail', [ toura._Capability ], {
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

