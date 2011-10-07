dojo.provide('toura.capabilities.PageNav_FeedTitle');

dojo.require('toura.capabilities._Capability');

dojo.declare('toura.capabilities.PageNav_FeedTitle', [ toura.capabilities._Capability ], {
  requirements : {
    feedItemDetail : 'FeedItemDetail',
    pageNav : 'PageNav'
  },

  init : function() {
    this.pageNav.set('screenTitle', this.page.baseObj.feedName);
  }
});
