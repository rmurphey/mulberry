describe("search input component", function() {
  var c, t, C, term = 'foo';

  beforeEach(function() {
    t = dojo.byId('test');

    if (c) { c.destroy(); }

    dojo.require('toura.components.SearchInput');

    C = function(config) {
      return new toura.components.SearchInput(config || {}).placeAt(t);
    };
  });

  it("should set up a search input component", function() {
    allDevices(function(d) {
      if (c) { c.destroy(); }
      c = C();

      expect(isWidgetRegistered('components_SearchInput')).toBeTruthy();

      expect(t.querySelector(getRootSelector(c))).toBeTruthy();

      expect(c.searchForm).toBeDefined();
      expect(c.searchButton).toBeDefined();
      expect(c.queryInput).toBeDefined();
      expect(c.i18n_placeholderText).toBeTruthy();
    });
  });

  it("should provide an API for setting the search term", function() {
    c = C();

    c.set('searchTerm', term);
    expect(c.queryInput.value).toBe(term);
  });

  it("should listen for the form to be submitted if touch is not available", function() {
    toura.app.UI.hasTouch = false;

    c = C();

    var touchHandler = getEventHandlers(c, 'touchstart', c.searchButton),
        submitHandler = getEventHandlers(c, 'submit', c.searchForm);

    expect(submitHandler.length).toBe(1);
    expect(touchHandler.length).toBe(0);

    spyOn(c, '_handleSubmit');

    submitHandler[0](fakeEventObj);
    expect(c._handleSubmit).toHaveBeenCalled();
  });

  it("should listen for the search button to be clicked if touch is available", function() {
    toura.app.UI.hasTouch = true;

    c = C();

    var touchHandler = getEventHandlers(c, 'touchstart', c.searchButton);

    expect(touchHandler.length).toBe(1);

    spyOn(c, '_handleSubmit');

    touchHandler[0](fakeEventObj);
    expect(c._handleSubmit).toHaveBeenCalled();
  });

  it("should announce searches when the form is submitted with a term", function() {
    var submitHandler;

    toura.app.UI.hasTouch = false;
    c = C();

    c.set('searchTerm', term);
    spyOn(c, 'search');
    submitHandler = getEventHandlers(c, 'submit', c.searchForm)[0];

    submitHandler(fakeEventObj);
    expect(c.search).toHaveBeenCalledWith(term);
  });

  it("should not announce searches if the form is submitted with no term", function() {
    var submitHandler;

    toura.app.UI.hasTouch = false;
    c = C();

    c.set('searchTerm', '');
    spyOn(c, 'search');
    submitHandler = getEventHandlers(c, 'submit', c.searchForm)[0];

    submitHandler(fakeEventObj);
    expect(c.search).not.toHaveBeenCalledWith(term);
  });

  it("should clear the query input when it gets focus", function() {
    c = C();

    c.queryInput.focus();
    expect(c.queryInput.value).toBeFalsy();
  });

  it("should put placeholder text in the input", function() {
    c = C();
    expect(c.queryInput.placeholder).toMatch(c.i18n_placeholderText);
  });

  it("should trim search terms before announcing them", function() {
    toura.app.UI.hasTouch = false;

    c = C();

    spyOn(c, 'search');
    c.set('searchTerm', '   ' + term + '  ');

    getEventHandlers(c, 'submit', c.searchForm)[0](fakeEventObj);
    expect(c.search).toHaveBeenCalledWith(term);
  });

  describe("autocomplete", function() {
    it("should attach a keyup handler to the search input", function() {
      c = C();

      spyOn(c, '_handleInput');

      getEventHandler(c, 'keyup')();
      expect(c._handleInput).toHaveBeenCalled();
    });

    it("should announce a search after more than <keybuffer> characters have been entered", function() {
      var comp = C(), term = '';
      spyOn(comp, 'search');

      runs(function() {
        comp.queryInput.value = '';
        comp._handleInput();
      });

      waits(comp.debounceTime * 2);

      runs(function() {
        expect(comp.search).not.toHaveBeenCalled();
      });

      runs(function() {
        while (term.length <= c.keybuffer) {
          term += 'a';
        }

        comp.queryInput.value = term;
        comp._handleInput();
      });

      waits(comp.debounceTime * 2);

      runs(function() {
        expect(comp.search).toHaveBeenCalled();
        comp.destroy();
      });
    });


    it("should wait until the user has finished typing to announce a search", function() {
      var comp = C(), times = 5;
      var spy = spyOn(comp, 'search');

      runs(function(){
        while (term.length <= c.keybuffer) {
          term += 'a';
        }

        comp.queryInput.value = term;

        while (times--) {
          setTimeout(dojo.hitch(comp, '_handleInput'), times * 25);
        }
      });

      waits(comp.debounceTime * 2);

      runs(function() {
        expect(spy.callCount).toBe(1);
      });

    });
  });


});
