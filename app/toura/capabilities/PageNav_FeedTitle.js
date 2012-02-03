dojo.provide('toura.capabilities.PageNav_FeedTitle');

dojo.require('mulberry._Capability');

dojo.declare('toura.capabilities.PageNav_FeedTitle', mulberry._Capability, {
  requirements : {
    feedItemDetail : 'FeedItemDetail',
    pageNav : 'PageNav'
  },

  init : function() {
    this.pageNav.set('screenTitle', this.page.baseObj.feedName);
  }
});
