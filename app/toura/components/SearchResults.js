dojo.provide('toura.components.SearchResults');

dojo.require('toura._Component');

dojo.declare('toura.components.SearchResults', toura._Component, {
  templateString : dojo.cache('toura.components', 'SearchResults/SearchResults.haml'),
  resultTemplate : Haml(dojo.cache('toura.components', 'SearchResults/Result.haml')),

  handleClicks : true,
  resultsToShow : 25,

  postCreate : function() {
    this.clickableNode = this.resultsContainer;
    this.inherited(arguments);
  },

  _setResultsAttr : function(results) {
    if (results && !dojo.isArray(results)) {
      throw new Error('toura.components.SearchResults::_setResultsAttr: results argument must be an array');
    }

    dojo.empty(this.resultsContainer);

    if (!results) {
      // there is no results array at all
      this._handleEmptySearch();
      return;
    }

    if (!results.length) {
      this._handleNoResults();
      return;
    }

    var moreResults = results.length > this.resultsToShow;

    this.results = results = results.slice(0, this.resultsToShow);

    this.populateElement(this.resultsContainer, dojo.hitch(this, function(r) {
      var result = dojo.mixin({}, r),
          a = result.asset;

      result.thumbnailURL = a && a.featured && a.featured.url;
      result.displayText = this._truncate(result.displayText);

      return this.resultTemplate(result);
    }), results);

    if (moreResults) {
      moreResults = dojo.create('li', {
        innerHTML : this.i18n_moreResults,
        className : 'more-results'
      });
      dojo.place(moreResults, this.resultsContainer, 'last');
    }

    dojo.publish('/content/update');
  },

  _handleNoResults : function() {
    this.resultsContainer.innerHTML = '<li>' + this.i18n_noResults + '</li>';
  },

  _handleEmptySearch : function() {
    this.resultsContainer.innerHTML = '<li>' + this.i18n_instructions + '</li>';
  },

  initializeStrings : function() {
    this.i18n_instructions = this.getString('SEARCH_INSTRUCTIONS');
    this.i18n_noResults = this.getString('SEARCH_NO_RESULTS');
    this.i18n_moreResults = this.getString('SEARCH_MORE_RESULTS');
  },

  _truncate : function(text) {
    return toura.util.truncate(text, 200);
  }
});
