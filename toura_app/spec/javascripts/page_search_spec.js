describe("search page controller", function() {
  var pc, PC, t, node,
      safeSearchTerm;

  beforeEach(function() {
    t = dojo.byId('test');
    if (pc) { pc.destroy(); }

    toura.app.UI = {
      supportsCssBackgroundContain : function() { return true; }
    };

    toura.lastSearchTerm = null;

    dojo.require('toura.pageControllers.search.Search');

    PC = function(config) {
      if (pc) { pc.destroy(); }
      return new toura.pageControllers.search.Search(config).placeAt(t);
    };

    // node for getting search stuff from
    node = node || nodeForController('Home1');
    safeSearchTerm = node.bodyText.body.split(' ')[1];
  });

  it("should create the search page", function() {
    allDevices(function(d) {
      pc = PC({ device : d });
      expect(t.querySelector(getRootSelector(pc))).toBeTruthy();
      expect(pc.searchInput).toBeDefined();
      expect(pc.searchResults).toBeDefined();
    });
  });

  it("should handle searches announced by the search input", function() {
    allDevices(function(d) {
      pc = PC({ device : d });

      spyOn(pc, 'set');
      spyOn(pc.searchResults, 'set');

      pc.searchInput.search(safeSearchTerm);

      expect(pc.set)
        .toHaveBeenCalledWith('searchTerm', safeSearchTerm);
      expect(pc.searchResults.set)
        .toHaveBeenCalledWith('results', dataAPI.search(safeSearchTerm));
    });
  });

  it("should populate the components if a term is passed in", function() {
    pc = PC({ device : devices[0] });

    spyOn(pc.searchResults, 'set');
    spyOn(pc.searchInput, 'set');

    pc.init(safeSearchTerm);
    expect(pc.searchResults.set)
      .toHaveBeenCalledWith('results', dataAPI.search(safeSearchTerm));
    expect(pc.searchInput.set)
      .toHaveBeenCalledWith('searchTerm', safeSearchTerm);
  });

  it("should not populate the components if a term is not passed in", function(){
    pc = PC({ device : devices[0] });

    spyOn(pc.searchResults, 'set');
    spyOn(pc.searchInput, 'set');

    pc.init();

    expect(pc.searchResults.set).not.toHaveBeenCalled();
    expect(pc.searchInput.set).not.toHaveBeenCalled();
  });

  it("should search for the last search term, if there is one", function() {
    var test;

    toura.lastSearchTerm = safeSearchTerm;

    pc = PC({
      device : devices[0],
      _handleSearch : function(term) {
        // note: i couldn't figure out how to use a spy here,
        // because postCreate will run before we have a chance to
        // set one up
        test = term;
      }
    });

    expect(test).toBe(safeSearchTerm);
  });

  it("should set the last search term when a search is performed", function() {
    expect(toura.lastSearchTerm).toBe(null);

    pc = PC({ device : devices[0] });
    pc.init(safeSearchTerm);
    expect(toura.lastSearchTerm).toBe(safeSearchTerm);
  });

  it("should not search for the same term twice", function() {
    pc = PC({ device : devices[0] });
    pc.init(safeSearchTerm);

    spyOn(pc, 'set');
    spyOn(pc.searchResults, 'set');

    pc.init(safeSearchTerm);
    expect(pc.set).not.toHaveBeenCalled();
    expect(pc.searchResults.set).not.toHaveBeenCalled();
  });

});
