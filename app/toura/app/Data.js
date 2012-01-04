dojo.provide('toura.app.Data');

dojo.require('dojo.data.ItemFileReadStore');
dojo.require('toura.models.TextAsset');
dojo.require('toura.models.SearchResult');

dojo.require('toura.models.Node');
dojo.require('toura.models.Feed');
dojo.require('toura.models.BackgroundImage');
dojo.require('toura.models.FeaturedImage');

dojo.declare('toura.app.Data', null, {
  cache : {},
  searchCache : {},

  models : {
    node : toura.models.Node,
    backgroundImage : toura.models.BackgroundImage,
    feed : toura.models.Feed,
    featuredImage : toura.models.FeaturedImage
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
      throw new Error('toura.app.Data::getModel requires an id. Possibly your hash string is invalid?');
    }

    if (!dojo.isString(id)) {
      throw new Error('toura.app.Data::getModel requires the id to be a string');
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
        throw new Error('toura.app.Data::getModel no model for type ' + type);
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
        Model = toura.models.SearchResult;

    var queries = [
      { type : 'text-asset', body : re },
      { type : 'text-asset', name : re }
    ];

    dojo.forEach(queries, function(q) {
      store.fetch({ query : q, onComplete : addItems });
    });

    dojo.forEach(matchingTextAssets, function(a) {
      var ta = new toura.models.TextAsset(store, a);
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
          return new toura.models.SearchResult(store, item);
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
