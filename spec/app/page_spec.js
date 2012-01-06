describe("configurable page controller", function() {
  var t, c, C;

  beforeEach(function() {
    dojo.require('toura.containers.Page');

    if (c) { c.destroy(); }

    C = function(config) {
      return new toura.containers.Page(config || {}).placeAt(t);
    };

    t = dojo.byId('test');
  });

  it("should create a page based on a template configuration", function() {
    var spy = spyOn(toura.containers, 'Screen').andCallThrough(),
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
    var spy = spyOn(toura.containers, 'Screen').andCallThrough();

    c = C({
      baseObj : {},
      device : devices[0],
      pageDef : {
        screens : [ 1 ]
      }
    });

    expect(spy.mostRecentCall.args[0].config).toBe(1);
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
    dojo.declare('toura.capabilities.FakeCapability', [], {});

    var spy = spyOn(toura.capabilities, 'FakeCapability');

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
    dojo.declare('toura.capabilities.FakeCapability', [], {});

    var spy = spyOn(toura.capabilities, 'FakeCapability');

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



});
