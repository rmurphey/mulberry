dojo.provide('toura.models.Feed');

dojo.require('dojo.io.script');
dojo.require('dojo.date.stamp');
dojo.require('mulberry.app.DeviceStorage');

(function() {

/**
 * @class
 *
 * @property {Number} throttle  The time in milliseconds to wait between
 * fetches
 * @property {String} feedUrl
 * @property {String} id
 * @property {String} name
 * @property {Number} lastChecked
 * @property {Array} items
 * @property {Number} updated
 */
dojo.declare('toura.models.Feed', null, {
  throttle : 5 * 1000, // 5 seconds

  /**
   * @constructor
   */
  constructor : function(store, item) {
    if (item && item.feed) {
      store.fetchItemByIdentity({
        identity : item.feed._reference,
        onItem : function(item) {
          dojo.mixin(this, {
            feedUrl : store.getValue(item, 'feedUrl'),
            id : store.getValue(item, 'id'),
            name : store.getValue(item, 'name')
          });
        },
        scope : this
      });
    } else {
      dojo.mixin(this, {
        feedUrl : store.getValue(item, 'feedUrl'),
        id : store.getValue(item, 'id'),
        name : store.getValue(item, 'name')
      });
    }

    this.lastChecked = mulberry.app.DeviceStorage.get(this.id + '-checked');
  },

  /**
   * @public
   *
   * @returns {Promise} A promise that may be resolved or rejected. If
   * resolved, the promise is resolved with an array of feed items; this array
   * may be empty, which indicates that no feed items were fetched but that
   * an attempt was made to fetch them. If rejected, the network was not
   * reachable and no attempt was made to load the feed items.
   */
  load : function() {
    var fn = dojo.hitch(dojo.io.script, 'get'),
        dfd = new dojo.Deferred();

    if (new Date().getTime() - this.lastChecked < this.throttle) {
      dfd.resolve(this._get());
    } else {
      mulberry.app.PhoneGap.network.isReachable()
        .then(dojo.hitch(this, function(reachable) {
          if (!reachable) {
            dfd.resolve(this._get());
            return;
          }

          fn({
            url : this._createFeedUrl(this.feedUrl),
            callbackParamName : 'callback',
            load : dojo.hitch(this, '_onLoad', dfd),
            error : dojo.hitch(this, '_onError', dfd),
            timeout : 2000
          });
        }));
    }

    return dfd.promise;
  },

  /**
   * @public
   * @param {Number} itemIndex  The index of the desired item
   */
  getItem : function(itemIndex) {
    this._get();
    var item = this.items[itemIndex];
    if (item) {
      item.siblings = this.items;
    }
    return item;
  },

  _onLoad : function(dfd, data) {
    this.lastChecked = new Date().getTime();

    if (data && data.items) {
      this.items = dojo.map(data.items, function(item, index) {
        item.index = index;
        return new toura.models.FeedItem(item, this);
      }, this);

    } else {
      console.warn('There were no results for feed', this.id, data);
      this.items = [];
    }

    this._store();

    dfd.resolve(this._get());
  },

  _onError : function(dfd) {
    console.warn('Unable to fetch remote feed');
    dfd.resolve([]);
  },

  _store : function() {
    mulberry.app.DeviceStorage.set(this.id, this.items);
    mulberry.app.DeviceStorage.set(this.id + '-checked', this.lastChecked);
  },

  _get : function() {
    this.items = dojo.map(
      mulberry.app.DeviceStorage.get(this.id) || [],
      function(item) {
        item.pubDate = new Date(item.pubDate);
        return item;
      }
    );

    return this.items;
  },

  _createFeedUrl : function(url){
    var escapedURI = encodeURIComponent(url);
    return mulberry.feedProxyUrl + "/feed?url=" + escapedURI;
  }
});

/**
 * @class
 *
 * @property {String} author
 * @property {String} content
 * @property {String} feedName
 * @property {String} id
 * @property {String} image
 * @property {String} pubDate
 * @property {String} summary
 * @property {String} title
 * @property {String} url
 */
dojo.declare('toura.models.FeedItem', null, {
  /**
   * @constructor
   */
  constructor : function(item, feed) {
    this.type = 'feedItem';

    dojo.mixin(this, {
      author : item.author,
      content : item.content,
      feedName : feed.name,
      id : feed.id + '-' + item.index,
      image : item.image || '',
      link : item.link,
      pubDate : new dojo.date.stamp.fromISOString(item.pubDate),
      summary : item.summary,
      title : item.title || '',
      url : toura.URL.feedItem(feed.id, item.index),
      video : item.video
    });
  }
});

}());
