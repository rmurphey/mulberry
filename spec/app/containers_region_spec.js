describe("containers region", function() {
  var c, C, t, flag;

  beforeEach(function() {
    dojo.require('toura.containers.Region');

    if (c) { c.destroy(); }

    C = function(config) {
      return new toura.containers.Region(config || {}).placeAt(t);
    };

    t = dojo.byId('test');

    dojo.declare('toura.components.FakeComponent', [], {
      placeAt : function() {
        flag = true;
      }
    });

    flag = false;
  });

  it("should create a region on the page", function() {
    c = C({
      screen : 'fake screen',
      config : {}
    });
    expect(t.querySelector(getRootSelector(c))).toBeTruthy();
    expect(c.screen).toBe('fake screen');
  });

  it("should create the specified components", function() {
    var spy = spyOn(toura.components, 'FakeComponent').andCallThrough();

    c = C({
      config : {
        components : [ 'FakeComponent' ]
      },
      baseObj : 'fake node',
      device : 'fake device',
      screen : 'fake screen'
    }).placeAt(t);

    expect(spy).toHaveBeenCalled();
    expect(spy.mostRecentCall.args[0].node).toBe('fake node');
    expect(spy.mostRecentCall.args[0].device).toBe('fake device');
    expect(spy.mostRecentCall.args[0].screen).toBe('fake screen');
    expect(flag).toBeTruthy();
  });

  it("should place child regions if specified", function() {
    c = C({
      config : {
        regions : [
          { },
          { },
          { }
        ]
      }
    });

    expect(c.domNode.querySelectorAll(getRootSelector(c)).length).toBe(3);
  });

});
