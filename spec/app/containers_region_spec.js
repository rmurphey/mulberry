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

  describe("scrollability", function() {
    beforeEach(function() {
      c = C({ config : { scrollable : true } }).placeAt(t);
      c._scroller.makeScroller(); // normally happens at page transition end
    });

    it("should set up a scroller if required", function() {
      expect(c._scroller).toBeDefined();
      expect(dojo.isFunction(c._scroller.scroller.options.onScrollStart)).toBeTruthy();
      expect(dojo.isFunction(c._scroller.scroller.options.onScrollEnd)).toBeTruthy();
    });

    it("should announce scroll events", function() {
      var startSpy = spyOn(c, 'onScrollStart'),
          endSpy = spyOn(c, 'onScrollEnd');

      c._scroller.scroller.options.onScrollStart();
      c._scroller.scroller.options.onScrollEnd();

      expect(startSpy).toHaveBeenCalled();
      expect(endSpy).toHaveBeenCalled();
    });
  });
});
