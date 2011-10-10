describe("home page controller", function() {
  var pc, node, t, PC;

  beforeEach(function() {
    t = dojo.byId('test');
    node = nodeForController('Home2');

    dojo.require('toura.pageControllers.node.Home2');

    PC = function(config) {
      if (pc) { pc.destroy(); }
      return new toura.pageControllers.node.Home2(config || {}).placeAt(t);
    };

    pageControllerMocks();
  });

  it("should create the home page", function() {
    allDevices(function(d) {
      pc = PC({ baseObj : node, device : d });
      expect(t.querySelector(getRootSelector(pc))).toBeTruthy();

      expect(isWidgetRegistered('components_BodyText')).toBeTruthy();
      expect(isWidgetRegistered('components_ChildNodes')).toBeTruthy();
      expect(isWidgetRegistered('components_AppNav')).toBeTruthy();

      expect(t.querySelector(getRootSelector(pc.bodyText))).toBeTruthy();
      expect(t.querySelector(getRootSelector(pc.childNodes))).toBeTruthy();
      expect(t.querySelector(getRootSelector(pc.appNav))).toBeTruthy();
    });
  });

  it("should pass the proper data to the components", function() {
    pc = PC({
      baseObj : dojo.mixin(node, {
        bodyText : null,
        children : []
      }),
      device : devices[0]
    });

    expect(pc.bodyText.bodyText).toBeFalsy();
    expect(pc.childNodes.children.length).toBe(0);

    pc.destroy();

    pc = PC({
      baseObj : dojo.mixin(node, {
        bodyText : { body : 'foo' }
      }),
      device : devices[0]
    });

    expect(pc.bodyText.bodyText).toBe('foo');
    expect(pc.childNodes.children).toBe(node.children);
  });

  it("should put the proper content on the page", function() {
    pc = PC({ baseObj : node, device : devices[0] });

    dojo.forEach(node.children, function(c) {
      expect(t.innerHTML).toMatch(c.name);
    });

    expect(t.innerHTML).toMatch(node.bodyText.body);
  });

});
