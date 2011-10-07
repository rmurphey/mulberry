dojo.provide('toura.pageControllers.search.Search');

dojo.require('toura.pageControllers._Page');
dojo.require('toura.components.SearchInput');
dojo.require('toura.components.SearchResults');
dojo.require('toura.app.URL');

dojo.declare('toura.pageControllers.search.Search', [ toura.pageControllers._Page ], {
  templateString : dojo.cache('toura.pageControllers.search', 'Search/Search.haml'),

  lastSearchTerm : null,

  type : 'search',

  postMixInProperties : function() {
    this.inherited(arguments);

    this.placements = [
      [ 'SearchInput', {}, 'searchInput' ],
      [ 'SearchResults', {}, 'searchResults' ]
    ];
  },

  postCreate : function() {
    this.inherited(arguments);

    this.connect(this.searchInput, 'search', '_handleSearch');

    if (toura.lastSearchTerm) {
      this._handleSearch(toura.lastSearchTerm);
    }
  },

  _handleSearch : function(term) {
    if (term === this.lastSearchTerm) { return; }
    this.set('searchTerm', term);
    this.searchResults.set('results', toura.app.Data.search(term));
  },

  _setSearchTermAttr : function(term) {
    this.lastSearchTerm = toura.lastSearchTerm = term;
    this.searchInput.set('searchTerm', term);
  },

  init : function(term) {
    if (!term) { return; }
    this._handleSearch(term);
  }
});
