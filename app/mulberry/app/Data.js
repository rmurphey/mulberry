dojo.provide('mulberry.app.Data');

dojo.require('dojo.data.ItemFileReadStore');
dojo.require('mulberry.models.TextAsset');
dojo.require('mulberry.models.SearchResult');

dojo.require('mulberry.models.Node');
dojo.require('mulberry.models.Feed');
dojo.require('mulberry.models.BackgroundImage');
dojo.require('mulberry.models.FeaturedImage');

dojo.declare('mulberry.app.Data', null, {
  cache : {},
  searchCache : {},

  models : {
    node : mulberry.models.Node,
    backgroundImage : mulberry.models.BackgroundImage,
    feed : mulberry.models.Feed,
    featuredImage : mulberry.models.FeaturedImage
  },

  constructor : function(data) {
    this.loadData(data);
  },

  loadData : function(data) {
    this.cache = {};
    this.searchCache = {};

    this._store = new dojo.data.ItemFileReadStore({
      data : {
        identifier : 'id',
        items : data
      },
      hierarchical : false
    });

    this.onLoadData(data);
  },

  onLoadData : function(data) {
    dojo.publish('/data/loaded', [ data ]);
    // stub for connection
  },

  getModel : function(id, type) {
    if (!id) {
      throw new Error('mulberry.app.Data::getModel requires an id. Possibly your hash string is invalid?');
    }

    if (!dojo.isString(id)) {
      throw new Error('mulberry.app.Data::getModel requires the id to be a string');
    }

    var cache = this.cache,
        store = this._store,
        item, Model;

    if (!cache[id]) {
      item = this.getById(id);
      if (!item) { return false; }

      type = type || store.getValue(item, 'type');
      Model = this.models[type];

      if (item && !Model) {
        throw new Error('mulberry.app.Data::getModel no model for type ' + type);
      }

      cache[id] = new Model(store, item);
    }

    return cache[id];
  },

  getById : function(id) {
    var ret;

    this._store.fetchItemByIdentity({
      identity : id,
      scope : this,
      onItem : dojo.hitch(this, function(item) {
        ret = item;
      })
    });

    return ret;
  },

  search : function(term) {
    if (!term || !dojo.trim(term)) { return []; }

    term = dojo.trim(term.replace(/\W/g, ' '));

    if (this.searchCache[term]) {
      return this.searchCache[term];
    }

    /*
     * Known limitations:
     *
     * - Only searches text assets and node titles
     * - Only searches for exact match
     */
    var matchingTextAssets = [],
        searchResults = [],
        store = this._store,
        addItems = function(items) {
          matchingTextAssets = matchingTextAssets.concat(items);
        },
        re = new RegExp(term, 'i'),
        seen = {},
        identifierSearchResults,
        Model = mulberry.models.SearchResult;

    var queries = [
      { type : 'text-asset', body : re },
      { type : 'text-asset', name : re }
    ];

    dojo.forEach(queries, function(q) {
      store.fetch({ query : q, onComplete : addItems });
    });

    dojo.forEach(matchingTextAssets, function(a) {
      var ta = new mulberry.models.TextAsset(store, a);
      searchResults = searchResults.concat(
        dojo.map(ta.contexts, function(c) {
          return new Model(store, {
            textAsset : ta, context : c
          });
        })
      );
    }, this);

    store.fetch({
      query : { type : 'node', name : re },
      onComplete : function(items) {
        searchResults = searchResults.concat(
          dojo.map(items, function(item) {
            return new Model(store, item);
          })
        );
      }
    });

    store.fetch({
      query : { type : 'node', identifier : re },
      onComplete : function(items) {
        identifierSearchResults = dojo.map(items, function(item) {
          return new mulberry.models.SearchResult(store, item);
        });
      }
    });

    searchResults = identifierSearchResults.concat(searchResults);

    // de-dupe
    searchResults = dojo.filter(searchResults, function(r) {
      if (seen[r.nodeId] && r.type === 'node') {
        return false;
      }

      if (seen[r.url]) {
        return false;
      }

      seen[r.url] = true;
      seen[r.nodeId] = true;
      return true;
    });

    this.searchCache[term] = searchResults;
    return searchResults;
  }
});
