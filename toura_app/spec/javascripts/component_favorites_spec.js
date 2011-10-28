describe("toura.components.Favorites", function() {
  var c, t, data, ds, node, favs, id = 'node-368';

  function C(config) {
    if (c) { c.destroy(); }
    return new toura.components.Favorites(config).placeAt(t);
  }

  beforeEach(function() {
    dojo.require('toura.components.Favorites');
    dojo.require('toura.app.user.Favorites');

    if (!ds) {
      ds = toura.app.DeviceStorage;
      ds.init(toura.app.Config.get('id'));
    }

    ds.set('favorites', null);

    if (!favs) { favs = toura.app.user.Favorites = new toura.app.user.Favorites(); }
    favs._empty();

    node = dataAPI.getModel(id);

    t = document.getElementById('test');

    if (c) { c.destroy(); }
  });

  it("should generate the component", function() {
    allDevices(function(d) {
      var deleteBtn, click;
          c = C({ device : d, favorites : [] });

      expect(c).toBeDefined();
      expect(c.domNode).toBeDefined();
      expect(c.favorites).toBeDefined();
      expect(c.favoritesList).toBeDefined();
      expect(t.querySelector(getRootSelector(c))).toBeTruthy();
    });
  });

  it("should list favorites", function() {
    allDevices(function(d) {
      var f, num;

      dojo.publish('/favorite/add', [ node ]);
      f = favs.load();
      num = f.length;

      c = C({ device : d, favorites : f });

      expect(c.favorites.length).toEqual(num);
      expect(c.favoritesList.childNodes.length).toEqual(num);
    });
  });

  it("should display a message if there are no favorites listed", function() {
    allDevices(function(d) {
      c = C({ device : d, favorites : [] });

      expect(c.favoritesList.childNodes.length).toEqual(1);
      expect(c.favoritesList.childNodes[0].innerText).toEqual(c.i18n_noFavorites);
    });
  });

  it("should allow you to delete favorites", function() {
    allDevices(function(d) {
      var spy = jasmine.createSpy(),
          f, num, click, deleteBtn;

      dojo.subscribe('/favorite/remove', spy);
      dojo.publish('/favorite/add', [ node ]);

      f = favs.load();
      num = f.length;

      c = C({ device : d, favorites : f });

      deleteBtn = c._supportingWidgets[0];
      deleteBtn.deleting = true;
      click = getEventHandlers(deleteBtn, 'touchstart', deleteBtn.domNode)[0];
      click(fakeEventObj);

      expect(spy).toHaveBeenCalledWith(deleteBtn.objId);
      expect(c.favoritesList.childNodes.length).toEqual(num -1);
    });
  });

});
