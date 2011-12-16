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
    var term = this.baseObj.term || toura.lastSearchTerm;

    this.getResults = this.baseObj.getResults;

    if (term) {
      this._handleSearch(term);
    }
  },

  _handleSearch : function(term) {
    if (term === this.lastSearchTerm) { return; }
    this.searchInput.set('searchTerm', term);
    this.searchResults.set('results', this.getResults(term));
    this.lastSearchTerm = toura.lastSearchTerm = term;
  }
});
