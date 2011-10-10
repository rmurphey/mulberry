describe("GridView page controller", function() {
  var pc, PC, t, node;

  beforeEach(function() {
    dojo.require('toura.pageControllers.node.GridView');
    t = dojo.byId('test');
    pageControllerMocks();

    node = nodeForController('GridView');

    PC = function(config) {
      if (pc) { pc.destroy(); }
      return new toura.pageControllers.node.GridView(config || {}).placeAt(t);
    };
  });

  it("should create the GridView page", function() {
    allDevices(function(d) {
      pc = PC({ baseObj : node, device : d });
      expect(t.querySelector(getRootSelector(pc))).toBeTruthy();
    });
  });

});
