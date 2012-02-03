dojo.provide('mulberry.capabilities.Page_Search');

dojo.require('mulberry._Capability');

dojo.declare('mulberry.capabilities.Page_Search', mulberry._Capability, {
  requirements : {
    searchInput : 'SearchInput',
    searchResults : 'SearchResults'
  },

  connects : [
    [ 'searchInput', 'search', '_handleSearch' ]
  ],

  init : function() {
    var term = this.baseObj.term || mulberry.lastSearchTerm;

    this.getResults = this.baseObj.getResults;

    if (term) {
      this._handleSearch(term);
    }
  },

  _handleSearch : function(term) {
    if (term === this.lastSearchTerm) { return; }
    this.searchInput.set('searchTerm', term);
    this.searchResults.set('results', this.getResults(term));
    this.lastSearchTerm = mulberry.lastSearchTerm = term;
  }
});
