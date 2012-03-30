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
  throttle : 5 * 60 * 1000, // 5 minutes

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
    var fn = mulberry.app.PhoneGap.present ?
        dojo.hitch(dojo, 'xhrGet') :
        dojo.hitch(dojo.io.script, 'get'),

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

          fn(this._createArgs(dfd));
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

    if (data && data.query && data.query.results && data.query.results.item) {
      this.items = dojo.map(data.query.results.item, function(item, index) {
        item.index = index;
        return new toura.models.FeedItem(item, this);
      }, this);

      this.updated = new dojo.date.stamp.fromISOString(data.query.created);
    } else {
      console.warn('There were no results for feed', this.id, data);
      this.items = [];
    }

    this._store();

    dfd.resolve(this._get());
  },

  _onError : function(dfd) {
    dfd.resolve(this._get() || []);
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

  _createArgs : function(dfd) {
    var req = {
      url : 'http://query.yahooapis.com/v1/public/yql',
      content : {
        q : "select * from feed where url='{{feed}}' limit 15".replace('{{feed}}', this.feedUrl),
        format : 'json'
      },
      preventCache : true,
      load : dojo.hitch(this, '_onLoad', dfd),
      error : dojo.hitch(this, '_onError', dfd)
    };

    if (!mulberry.app.PhoneGap.present) {
      req.callbackParamName = 'callback';
    } else {
      req.handleAs = 'json';
    }

    return req;
  }
});

/**
 * @class
 *
 * @property {String} title
 * @property {String} name
 * @property {String} body
 * @property {String} link
 * @property {String} pubDate
 * @property {Object} image
 * @property {String} author
 * @property {String} id
 * @property {String} feedName
 */
dojo.declare('toura.models.FeedItem', null, {
  /**
   * @constructor
   */
  constructor : function(item, feed) {
    this.type = 'feedItem';

    dojo.mixin(this, {
      title : item.title || '',
      url : toura.URL.feedItem(feed.id, item.index),
      link : item.link,
      pubDate : item.pubDate,
      name : item.title,
      feedName : feed.name,
      id : feed.id + '-' + item.index
    });

    if (this.link && dojo.isObject(this.link)) {
      this.link = this.link.content || null;
    }

    if (dojo.isObject(this.title)) {
      this.title = this.title.content || null;
    }

    this.media = this._getMedia(item);

    this.body = this._getBody(item);
    this.image = this._getImage(item);
    this.author = this._getAuthor(item);
  },

  _getBody : function(item) {
    var description = item.description;

    if (dojo.isArray(description)) {
      return description[1] || "";
    }

    return description || "";
  },

  _getImage : function(item) {
    var enc;

    if (item.thumbnail && dojo.isArray(item.thumbnail)) {
      enc = item.thumbnail[1];
    } else {
      enc = item.enclosure || item.content;
    }

    if (!enc) { return ''; }

    if (!dojo.isObject(enc) && enc.match(/(jpeg|jpg|png)/i)) {
      return { url : enc };
    }

    if (enc && enc.type && enc.type.match(/(jpeg|png)/i)) {
      return { url : enc.url };
    }

    // media feed case
    if (this.media && item.thumbnail) {
      return { url: item.thumbnail.url };
    }

    return '';
  },

  _getAuthor : function(item) {
    var author = item.author;

    if (item.creator) {
      return item.creator;
    }

    if (author && author.displayName) {
      return author.displayName;
    }

    return '';
  },

  _getMedia : function(item) {
    var media = item.content;

    if (media && media.url && media.type) {
      return media;
    }

    return '';
  }
});

}());
