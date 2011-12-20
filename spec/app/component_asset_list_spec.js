describe("asset list component", function() {
  var t, C, qs, qsa,
      config = {
        node : {
          assets : [
            {
              name : 'asset 1',
              id : 'asset-1'
            },
            {
                name : 'asset 2',
                id : 'asset-2'
            }
          ],
          assetTypeUrl : function() {
            return 'fake';
          }
        },
        type : 'assets'
      };

  beforeEach(function() {
    dojo.require('toura.components.AssetList');
    C = toura.components.AssetList;

    t = dojo.byId('test');
    dojo.empty(t);

    toura.app.UI.hasTouch = false;
  });

  it("should create an asset list component", function() {
    var c = new C(config).placeAt(t);
    expect(t.querySelector(getRootSelector(c))).toBeTruthy();
  });

  it("should populate the list with the provided assets", function() {
    var c = new C(config).placeAt(t);
    expect(c.list.children.length).toBe(2);
    expect(t.innerHTML.match('asset 1')).toBeTruthy();
    expect(t.innerHTML.match('asset 2')).toBeTruthy();
  });

  it("should mark an asset current when it is set as the current asset", function() {
    var c = new C(config).placeAt(t),
        asset = config.node.assets[0];

    c.set('currentAsset', asset.id);

    var current = t.querySelectorAll('.current');
    expect(current.length).toBe(1);
    expect(current[0].innerHTML).toMatch(asset.name);
  });

  it("should bind selection event handlers to all assets", function() {
    // TODO: deal with toura.app.UI.hasTouch == true;
    var c = new C(config).placeAt(t);

    var eventHandlers = dojo.every(c.list.children, function(el) {
      return getEventHandlers(c, 'click', el).length;
    });

    expect(eventHandlers).toBeTruthy();
  });

  describe("user interaction", function() {
    // TODO: deal with toura.app.UI.hasTouch == true;
    var c, firstElClickHandler;

    beforeEach(function() {
      c = new C(config).placeAt(t);
      firstElClickHandler = getEventHandlers(c, 'click', c.list.children[0])[0];
    });

    it("should call its onSelect method when a user selects an asset", function() {
      spyOn(c, 'onSelect');
      firstElClickHandler({ preventDefault : function() { } });
      expect(c.onSelect).toHaveBeenCalledWith('asset-1');
    });

    it("should mark an asset selected when a user selects it", function() {
      firstElClickHandler({ preventDefault : function() { } });
      expect(t.querySelector('.current')).toBeTruthy();
    });

  });

});
