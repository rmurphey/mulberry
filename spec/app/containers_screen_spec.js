describe("containers screen", function() {
  var c, C, t, flag;

  beforeEach(function() {
    dojo.require('toura.containers.Screen');

    if (c) { c.destroy(); }
    C = function(config) {
      return new toura.containers.Screen(config || {}).placeAt(t);
    };

    t = dojo.byId('test');
  });

  it("should create a screen on the page", function() {
    c = C({ config : {} });
    expect(t.querySelector(getRootSelector(c))).toBeTruthy();
  });

  it("should create regions if they are specified", function() {
    var spy = spyOn(toura.containers, 'Region').andCallThrough();

    c = C({
      config : {
        regions : [
          { scrollable : true },
          { scrollable : true },
          { scrollable : true }
        ]
      },
      baseObj : 'fake node',
      device : 'fake device'
    });

    expect(spy.callCount).toBe(3);

    var regionArgs = spy.mostRecentCall.args[0];

    expect(regionArgs.config).toEqual({ scrollable: true});
    expect(regionArgs.baseObj).toBe('fake node');
    expect(regionArgs.device).toBe('fake device');
    expect(regionArgs.screen).toBe(c);
  });

});
