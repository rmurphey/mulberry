dojo.provide('toura.components.FeedItemList');

dojo.require('mulberry._Component');
dojo.require('dojo.date.locale');
dojo.require('mulberry.Utilities');

dojo.declare('toura.components.FeedItemList', mulberry._Component, {
  templateString : dojo.cache('toura.components', 'FeedItemList/FeedItemList.haml'),
  itemTemplate : Haml(dojo.cache('toura.components', 'FeedItemList/FeedItem.haml')),

  prepareData : function() {
    this.feed = this.node.feeds && this.node.feeds[0];
  },

  setupConnections : function() {
    this.inherited(arguments);

    if (this.feed) {
      this.connect(this.refreshButton, 'click', '_loadFeed');
    }

    this.connect(this.feedItemList, 'touchmove', function() {
      this.moved = true;
    });

    this.connect(this.feedItemList, mulberry.app.UI.hasTouch ? 'touchend' : 'click', '_onSelect');
  },

  startup : function() {
    this.inherited(arguments);
    this._loadFeed();
  },

  _loadFeed : function() {
    this.addClass('loading');

    this.feed.load().then(
      dojo.hitch(this, '_populate'),
      dojo.hitch(this, '_handleNoNetwork')
    );
  },

  _populate : function(items) {
    this.removeClass('loading');

    if (!items.length) {
      var li = dojo.create('li', { innerHTML : this.i18n_noItems });
      dojo.place(li, this.feedItemList, 'only');
      return;
    }

    this.populateElement(this.feedItemList, dojo.hitch(this, function(item, idx) {
      item.displayText = mulberry.util.truncate(item.content, 200);
      item.index = idx;
      item.pubDate = dojo.date.locale.format(item.pubDate);
      return this.itemTemplate(item);
    }), items);

    this.lastUpdated.innerHTML = ' ' + dojo.date.locale.format(new Date());

    this.region.refreshScroller();
    this.onPopulate();
  },

  onPopulate : function() {
    // stub
  },

  _handleNoNetwork : function() {
    this.removeClass('loading');
    var li = dojo.create('li', { innerHTML : this.i18n_noNetwork });
    dojo.place(li, this.feedItemList, 'only');
  },

  _onSelect : function(e) {
    if (this.moved) {
      this.moved = false;
      return;
    }

    e.preventDefault();

    var t = e.target, index;

    while (t.nodeName.toLowerCase() !== 'li') {
      t = t.parentNode;
    }

    index = dojo.attr(t, 'data-index');

    dojo.forEach(t.parentNode.childNodes, function(el) {
      dojo.removeClass(el, 'active');
    });

    dojo.addClass(t, 'active');

    if (index) {
      this.onSelect(this.feed.id, index);
    }
  },

  onSelect : function(feedId, feedItemIndex) {
    console.log('onSelect', feedId, feedItemIndex);
    // stub for connection
  },

  initializeStrings : function() {
    this.i18n_noNetwork = this.getString('NO_NETWORK');
    this.i18n_noItems = this.getString('FEED_NO_ITEMS');
    this.i18n_feedRefresh = this.getString('FEED_REFRESH');
  }
});

