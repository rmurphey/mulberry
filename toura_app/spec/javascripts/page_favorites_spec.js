describe("favorites page controller", function() {
  var pc, PC, t, ds, node, nodeId = 'node-368';

  beforeEach(function() {
    dojo.require('toura.pageControllers.favorites.Favorites');
    dojo.require('toura.app.user.Favorites');
    dojo.require('toura.components.Favorites');
    dojo.require('toura.app.DeviceStorage');

    toura.app.Config.set('app', toura.data.local);
    if (!ds) {
      ds = toura.app.DeviceStorage;
      ds.init(toura.app.Config.get('id'));
    }

    ds.set('favorites', null);

    node = dataAPI.getModel(nodeId);

    t = dojo.byId('test');
    if (pc) { pc.destroy(); }
    if (!toura.app.user.Favorites.load) { toura.app.user.Favorites = new toura.app.user.Favorites(); }

    PC = function(device) {
      if (pc) { pc.destroy(); }
      return new toura.pageControllers.favorites.Favorites({ device : device }).placeAt(t);
    };
  });

  it("should create the favorites page", function() {
    // generate tested element for all devices, verify all required subcoponents are available
    allDevices(function(d) {
      pc = PC({ device : d });

      expect(t.querySelector(getRootSelector(pc))).toBeTruthy();
      expect(pc.pageNav).toBeDefined();
      expect(pc.favorites).toBeDefined();
    });

  });

  it("should pass favorites information to favorites component", function() {
    var favs;
    dojo.publish('/favorite/add', [ node ]);

    favs = toura.app.user.Favorites.load();
    pc = PC({ device : devices[0] });

    expect(pc.favorites.favorites.length).toEqual(favs.length);
  });

});
