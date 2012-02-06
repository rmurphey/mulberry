describe("search results component", function() {
  var t, c, C, results;

  beforeEach(function() {
    t = dojo.byId('test');

    dojo.require('toura.components.SearchResults');
    C = function(config) {
      return new toura.components.SearchResults(config || {}).placeAt(t);
    };

    dataAPI._store.fetch({
      query : { type : 'text-asset' },
      onComplete : function(items) {
        var term = items[1].body[0].split(' ')[2];
        results = dataAPI.search(term);
      }
    });
  });

  it("should set up a search results component", function() {
    allDevices(function(d) {
      if (c) { c.destroy(); }

      c = C();

      dojo.publish('/page/transition/end');

      expect(t.querySelector(getRootSelector(c))).toBeTruthy();
      expect(isWidgetRegistered('components_SearchResults')).toBeTruthy();

      expect(c.resultsContainer).toBeDefined();

      expect(c.i18n_instructions).toBeDefined();
      expect(c.i18n_noResults).toBeDefined();
      expect(c.i18n_moreResults).toBeDefined();
    });
  });

  it("should properly diplay results when they are provided", function() {
    c = C();
    results[0].displayText = '<p>test display text</p>';
    c.set('results', results);

    // did the title get displayed?
    expect(c.resultsContainer.innerHTML).toMatch(results[0].nodeTitle);

    // did the display text get displayed?
    expect(c.resultsContainer.innerHTML).toMatch('test display text');

    // is there a link to the result page?
    expect(c.resultsContainer.querySelectorAll(
      'a[href="' + results[0].url + '"]'
    ).length).toBeTruthy();

    // are the results properly classed?
    expect(dojo.hasClass(c.resultsContainer.firstChild, results[0].type))
      .toBeTruthy();
  });

  it("should throw an error if the results provided are invalid", function() {
    c = C();

    expect(function() {
      c.set('results', 'wrong value type');
    }).toThrow();

    expect(function() {
      c.set('results', null);
    }).not.toThrow();

    expect(function() {
      c.set('results', []);
    }).not.toThrow();

    expect(function() {
      c.set('results', false);
    }).not.toThrow();
  });

  it("should indicate when there are no results", function() {
    c = C();
    c.set('results', []);
    expect(c.domNode.innerHTML).toMatch(c.i18n_noResults);

    c.set('results', null);
    expect(c.domNode.innerHTML).toMatch(c.i18n_instructions);
  });

  it("should indicate when there are more results than can be shown", function() {
    c = C();

    var max = c.resultsToShow + 1;

    while (max--) {
      results.push(results[0]);
    }

    c.set('results', results);
    expect(c.resultsContainer.lastChild.innerHTML).toBe(c.i18n_moreResults);
    expect(c.resultsContainer.children.length).toBe(c.resultsToShow + 1);
  });

});
