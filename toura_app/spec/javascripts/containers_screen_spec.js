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

  it("should allow the layout to be specified", function() {
    c = C({
      config : { containerType : 'something' }
    });

    expect(dojo.hasClass(c.domNode, 'something-container')).toBeTruthy();
  });

  it("should create regions if they are specified", function() {
    var spy = spyOn(toura.containers, 'Region').andCallThrough();

    c = C({
      config : {
        regions : [
          { type: 'row'},
          { type: 'row'},
          { type: 'row'}
        ]
      },
      baseObj : 'fake node',
      device : 'fake device'
    });

    expect(spy.callCount).toBe(3);

    var regionArgs = spy.mostRecentCall.args[0];

    expect(regionArgs.config).toEqual({ type: 'row'});
    expect(regionArgs.baseObj).toBe('fake node');
    expect(regionArgs.device).toBe('fake device');
    expect(regionArgs.screen).toBe(c);
  });


  it("should set the layout class on the screen element if a layout is defined in the template config", function() {
    c = C({
      device : 'fake device',
      config : {
        layoutName : 'fake-layout'
      }
    });

    expect(dojo.hasClass(c.domNode, 'fake-layout')).toBeTruthy();
  });

});
