dojo.provide('toura.components.FeedItemDetail');

dojo.require('toura._Component');
dojo.require('dojo.date.locale');

dojo.declare('toura.components.FeedItemDetail', toura._Component, {
  templateString : dojo.cache('toura.components', 'FeedItemDetail/FeedItemDetail.haml'),
  itemTemplate : Haml(dojo.cache('toura.components', 'FeedItemDetail/Item.haml')),

  prepareData : function() {
    this.item = this.node;
  },

  setupConnections : function() {
    this.connect(this.externalLink, 'click', function(e) {
      e.preventDefault();
      toura.app.PhoneGap.browser.url(this.item.link);
    });
  },

  initializeStrings : function() {
    this.i18n_viewOriginal = this.getString('FEED_VIEW_ORIGINAL');
  },

  _setItemAttr : function(feedItem) {
    if (feedItem.type !== 'feedItem') { return; }

    this.item = feedItem;

    dojo.empty(this.content);

    dojo.place(this.itemTemplate(
      dojo.delegate(this.item, {
        pubDate : dojo.date.locale.format(this.item.pubDate),
        i18n_viewOriginal : this.i18n_viewOriginal
      })
    ), this.content);

    dojo.attr(this.externalLink, 'href', this.item.link);

    this._setupLinks();

    if (this.region) {
      this.region.refreshScroller();
    }
  },

  _setupLinks : function() {
    dojo.forEach(this.domNode.querySelectorAll('.content a'), function(link) {
      dojo.attr(link, 'target', '_blank');
    }, this);
  }
});

