dojo.provide('toura.capabilities.Page_Search');

dojo.require('toura._Capability');

dojo.declare('toura.capabilities.Page_Search', toura._Capability, {
  requirements : {
    searchInput : 'SearchInput',
    searchResults : 'SearchResults'
  },

  connects : [
    [ 'searchInput', 'search', '_handleSearch' ]
  ],

  init : function() {
    this.results = this.node.results;

    if (toura.lastSearchTerm) {
      this._handleSearch(toura.lastSearchTerm);
    }
  },

  _handleSearch : function(term) {
    if (term === this.lastSearchTerm) { return; }
    this.searchInput.set('searchTerm', term);
    this.searchResults.set('results', this.results(term));
    this.lastSearchTerm = toura.lastSearchTerm = term;
  }
});
