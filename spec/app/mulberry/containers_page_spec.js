describe("page container", function() {
  var t, c, C;

  beforeEach(function() {
    dojo.require('mulberry.containers.Page');

    if (c) { c.destroy(); }

    C = function(config) {
      return new mulberry.containers.Page(config || {}).placeAt(t);
    };

    t = dojo.byId('test');
  });

  it("should create a page based on a template configuration", function() {
    var spy = spyOn(mulberry.containers, 'Screen').andCallThrough(),
        i = 0;

    allDevices(function(d) {
      i++;

      c = C({
        baseObj : {},
        device : d,
        pageDef : {
          screens : [ 1 ]
        }
      });

      expect(t.querySelector(getRootSelector(c))).toBeTruthy();
      expect(spy.callCount).toBe(i);
    });
  });

  it("should pass config information to the screens", function() {
    var spy = spyOn(mulberry.containers, 'Screen').andCallThrough(),
        baseObj = {
          pageBackground : 'pageBackground'
        };

    c = C({
      baseObj : baseObj,
      device : devices[0],
      pageDef : {
        screens : [ 1 ]
      }
    });

    var args = spy.mostRecentCall.args[0];

    expect(args.config).toBe(1);
    expect(args.backgroundImage).toBe('pageBackground');
    expect(args.baseObj).toBe(baseObj);
    expect(args.device).toBe(devices[0]);
    expect(args.page).toBe(c);
  });

  it("should throw an error if a node is not provided", function() {
    expect(function() {
      c = C({
        device : devices[0],
        pageDef : {
          screens : [ 1 ]
        }
      });
    }).toThrow();
  });

  it("should throw an error if no screens are defined", function() {
    expect(function() {
      c = C({
        baseObj : {},
        device : d,
        pageDef : { }
      });
    }).toThrow();
  });

  it("should throw an error if there is no template config", function() {
    expect(function() {
      c = C({
        baseObj : {},
        device : d
      });
    }).toThrow();
  });

  it("should set up specified capabilities", function() {
    dojo.declare('mulberry.capabilities.FakeCapability', [], {});

    var spy = spyOn(mulberry.capabilities, 'FakeCapability');

    c = C({
      baseObj : {},
      device : devices[0],
      pageDef : {
        screens : [ 1 ],
        capabilities : [
          { name : 'FakeCapability' }
        ]
      }
    });

    expect(spy).toHaveBeenCalled();
  });

  it("should work with capabilities as an array of strings", function() {
    dojo.declare('mulberry.capabilities.FakeCapability', [], {});

    var spy = spyOn(mulberry.capabilities, 'FakeCapability');

    c = C({
      baseObj : {},
      device : devices[0],
      pageDef : {
        screens : [ 1 ],
        capabilities : [ 'FakeCapability' ]
      }
    });

    expect(spy).toHaveBeenCalled();
  });

  it("should allow registering other namespaces for capabilities", function() {
    dojo.declare('another.namespace.MyCapability', [], {});
    mulberry.registerCapabilityNamespace(another.namespace);

    var spy = spyOn(another.namespace, 'MyCapability');

    c = C({
      baseObj : {},
      device : devices[0],
      pageDef : {
        screens : [ 1 ],
        capabilities : [ 'MyCapability' ]
      }
    });

    expect(spy).toHaveBeenCalled();
  });

  describe("class names", function() {
    it("should add the appropriate class names", function() {
      c = C({
        baseObj : {
          id : 'mypage'
        },
        pageDefName : 'mypagedef',
        pageDef : {
          screens : [ 1 ]
        }
      });

      dojo.forEach([ 'page', 'page-mypage', 'mypagedef' ], function(klass) {
        expect(dojo.hasClass(c.domNode, klass)).toBeTruthy();
      });
    });

    it("should not add the page- classname if there is no base object id", function() {
      c = C({
        baseObj : { },
        pageDef : {
          screens : [ 1 ]
        }
      });

      expect(c.domNode.className).not.toMatch('page-');
    });
  });
});
