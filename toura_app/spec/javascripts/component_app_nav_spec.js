describe("app nav component", function() {
  var t, url, favs;

  beforeEach(function() {
    dojo.require('toura.components.AppNav');
    dojo.require('toura.app.URL');
    dojo.require('toura.app.user.Favorites');

    favs = toura.app.user.Favorites = favs || new toura.app.user.Favorites();
    toura.app.Config.set('app', {});

    url = toura.app.URL;
    t = dojo.byId('test');
    dojo.empty(t);
  });


  it("should create an app nav component", function() {
    var comp = new toura.components.AppNav().placeAt(t);
    expect(t.querySelector(getRootSelector(comp))).toBeTruthy();
  });

  describe("search button", function() {
    it("should always have a search button", function() {
      var comp = new toura.components.AppNav().placeAt(t);

      var search = dojo.query('a[href="' + url.search() + '"]', t);
      expect(search.length).toBe(1);
    });
  });

  describe("map button", function() {
    it("should show the map button if map node is enabled and there is a map node", function() {
      toura.app.Config.set('app', {
        mapsEnabled : true,
        mapNodeId : 'node-1'
      });

      var comp = new toura.components.AppNav().placeAt(t);

      var map = dojo.query('a[href="' + url.maps() + '"]', t);
      expect(map.length).toBe(1);
    });

    it("should not show the map button if map node is not enabled", function() {
      toura.app.Config.set('app', {
        mapsEnabled : false,
        mapNodeId : 'node-1'
      });

      var comp = new toura.components.AppNav().placeAt(t);

      var maps = dojo.query('a[href="' + url.maps() + '"]', t);
      expect(t.querySelectorAll('.component.app-nav').length).toBe(1);
      expect(maps.length).toBe(0);
    });

    it("should not show the maps button if there is no maps node", function() {
      toura.app.Config.set('app', {
        mapsEnabled : true
      });

      var comp = new toura.components.AppNav().placeAt(t);

      var maps = dojo.query('a[href="' + url.maps() + '"]', t);
      expect(t.querySelectorAll('.component.app-nav').length).toBe(1);
      expect(maps.length).toBe(0);
    });
  });

  describe("about button", function() {
    it("should show the about button if there is an about node", function() {
      toura.app.Config.set('app', {
        aboutNodeId : 'node-1',
        aboutEnabled : true
      });

      var comp = new toura.components.AppNav().placeAt(t);

      var about = dojo.query('a[href="' + url.about() + '"]', t);
      expect(t.querySelectorAll('.component.app-nav').length).toBe(1);
      expect(about.length).toBe(1);
    });

    it("should not show the about button if there is not an about node", function() {
      var comp = new toura.components.AppNav().placeAt(t);

      var about = dojo.query('a[href="' + url.about() + '"]', t);
      expect(t.querySelectorAll('.component.app-nav').length).toBe(1);
      expect(about.length).toBe(0);
    });
  });

  describe("favorites button", function() {
    it("should show the favorites button if favorites are not disabled", function() {
      var comp = new toura.components.AppNav().placeAt(t);

      var fav  = dojo.query('a[href="' + url.favorites() + '"]', t);
      expect(t.querySelectorAll('.component.app-nav').length).toBe(1);
      expect(fav.length).toBe(1);
    });

    it("should not show the favorites button if favorites are disabled", function() {
      toura.features.favorites = false;
      var comp = new toura.components.AppNav().placeAt(t);

      var fav  = dojo.query('a[href="' + url.favorites() + '"]', t);
      expect(t.querySelectorAll('.component.app-nav').length).toBe(1);
      expect(fav.length).toBe(0);
    });
  });

});

