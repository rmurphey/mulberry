describe("Images2 page controller", function() {
  var pc, PC, t, node;

  beforeEach(function() {
    dojo.require('toura.pageControllers.node.Images2');
    t = dojo.byId('test');
    pageControllerMocks();

    node = nodeForController('Images2');

    PC = function(config) {
      if (pc) { pc.destroy(); }
      return new toura.pageControllers.node.Images2(config || {}).placeAt(t);
    };
  });

  it("should create the Images2 page", function() {

    dojo.forEach(devices, function(d) {
      pc = PC({ baseObj : node, device : d });
      expect(t.querySelector(getRootSelector(pc))).toBeTruthy();
      expect(pc.detail).toBeDefined();
    });
  });

});
