describe("favorites API", function() {
  var api, data, ds, node, id = 'node-image_gallery';

  beforeEach(function() {
    dojo.require('toura.app.user.Favorites');
    dojo.require('toura.app.DeviceStorage');
    dojo.require('toura.app.Data');

    toura.app.Config.set('app', toura.data.local);

    if (!ds) {
      ds = toura.app.DeviceStorage;
      ds.init(toura.app.Config.get('id'));
    }

    ds.set('favorites', null);

    if (!api) {
      api = new toura.app.user.Favorites();
    }

    api._empty();
    node = dataAPI.getModel(id);
  });

  describe("favorites management api", function() {
    it("should allow objects to be favorited", function() {
      dojo.publish('/favorite/add', [ node ]);

      var favs = api.load(), fav = favs[0];

      expect(favs.length).toBe(1);

      expect(fav.id).toBe(id);
      expect(fav.name).toBe(node.name);
      expect(fav.added).toBeDefined();
      expect(fav.displayDate).toBeDefined();
      expect(fav.model).toBeDefined();
    });

    it("should allow favorites to be removed", function() {
      var favs;

      dojo.publish('/favorite/add', [ node ]);
      favs = api.load();
      expect(favs.length).toBe(1);

      dojo.publish('/favorite/remove', [ node ]);
      favs = api.load();
      expect(favs.length).toBe(0);
    });

    it("should not add duplicate objects to favorites", function() {
      var favs;

      dojo.publish('/favorite/add', [ node ]);
      dojo.publish('/favorite/add', [ node ]);

      favs = api.load();
      expect(favs.length).toBe(1);
    });

    it("should allow all favorites to be cleared", function() {
      var favs;

      dojo.publish('/favorites/clear');
      favs = api.load();
      expect(favs.length).toBe(0);
    });
  });

  describe("favorites access", function() {
    it("should return an empty array if there are no favorites", function() {
      expect(api.load()).toBeDefined();
      expect(api.load().length).toBe(0);
    });

    it("should return a list of saved favorites", function() {
      var favs;

      dojo.publish('/favorite/add', [ dataAPI.getModel('node-videos') ]);
      dojo.publish('/favorite/add', [ dataAPI.getModel('node-audio_list') ]);

      favs = api.load();
      expect(favs.length).toBe(2);
    });

    it("should sort the saved favorites by a provided property and sort order", function() {
      var favs;

      dojo.publish('/favorite/add', [ dataAPI.getModel('node-videos') ]);
      dojo.publish('/favorite/add', [ dataAPI.getModel('node-audio_list') ]);

      favs = api.load('name');
      expect(favs[0].name < favs[1].name).toBeTruthy();

      favs = api.load('name', true);
      expect(favs[0].name < favs[1].name).toBeFalsy();
    });

    it("should indicate whether an object is a favorite", function() {
      dojo.publish('/favorite/add', [ node ]);
      expect(api.isFavorite(node)).toBeTruthy();
      expect(api.isFavorite(dataAPI.getModel('node-location_map'))).toBeFalsy();
    });
  });

  describe("favorites maintenance", function() {
    it("should mark a favorite deleted if it is no longer present in the tour data", function() {
      dojo.publish('/favorite/add', [ node ]);
      dojo.publish('/favorite/add', [ dataAPI.getModel('node-videos') ]);

      // simulate refreshing data via OTA
      var idToRemove = id,
          items = dojo.filter(toura.data.local.items, function(item) {
            return item.id[0] !== idToRemove;
          }, this),
          favs;

      dataAPI.loadData(items);

      favs = api.load('added');
      expect(favs[0].deleted).toBeTruthy();
      expect(favs[1].deleted).toBeFalsy();

    });
  });
});
