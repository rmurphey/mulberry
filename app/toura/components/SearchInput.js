dojo.provide('toura.components.SearchInput');

dojo.require('toura._Component');
dojo.require('toura.components.buttons.BackButton');

dojo.declare('toura.components.SearchInput', toura._Component, {
  templateString : dojo.cache('toura.components', 'SearchInput/SearchInput.haml'),
  _oldValue : null,

  keybuffer : 3,
  debounceTime : 300,
  timeout : null,
  widgetsInTemplate : true,

  setupConnections : function() {
    this.connect(this.queryInput, 'focus', function(){
      // ios shifts the page to the left when the field gets focus
      window.scrollTo(0, 0);
      this.queryInput.value = '';
    });

    this.connect(this.queryInput, 'keyup', '_handleInput');

    if (toura.app.UI.hasTouch) {
      this.connect(this.searchButton, 'touchstart', '_handleSubmit');
    }

    this.connect(this.searchForm, 'submit', '_handleSubmit');
  },

  _setSearchTermAttr : function(term) {
    this.queryInput.value = term || '';
  },

  _handleInput : function() {
    if (dojo.trim(this.queryInput.value).length < this.keybuffer) {
      return;
    }

    clearTimeout(this.timeout);

    this.timeout = setTimeout(dojo.hitch(this, function() {
      this._search(this.queryInput.value);
    }), this.debounceTime);
  },

  _handleSubmit : function(e) {
    e.preventDefault();
    e.stopPropagation();
    var q = this.queryInput.value;

    if (/^toura:./.test(q)) {
      console.log('found toura:');
      dojo.publish('/debug/user', [ q ]);
      return;
    }

    this._search(q);
  },

  _search : function(q) {
    q = dojo.trim(q);
    if (!q) { return; }
    if (q === this._oldValue) { return; }

    this.search(q);

  },

  search : function(q) {
    // stub for connections, so we can announce
    // the search to other components
  },

  initializeStrings : function() {
    this.i18n_placeholderText = this.getString('SEARCH_PLACEHOLDER_TEXT');
  }
});
