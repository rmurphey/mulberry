describe("google map page controller", function() {
  /**
   * Note that this whole suite has one major weakness: actually setting up
   * the Google Map doesn't seem to work in the suite. I can't figure out why
   * this is. Note also that the last test is an async test, and that it seems
   * to need to be the last test in order for *any* of the tests to work. I
   * think this is because Jasmine doesn't wait for it to finish before running
   * subsequent tests, and since the test involves adding the Google Maps API
   * javascript to the page, subsequent tests end up using the wrong
   * javascript, and everything goes to hell.
   **/
  var pc, node, t, PC;

  beforeEach(function() {
    t = dojo.byId('test');
    node = nodeForController('GoogleMap1');

    if (pc) { pc.destroy(); }

    dojo.require('toura.pageControllers.node.GoogleMap1');

    PC = function(config) {
      if (pc) { pc.destroy(); }
      return new toura.pageControllers.node.GoogleMap1(config || {}).placeAt(t);
    };

    toura.app.Phonegap = {
      network : {
        isReachable : function() {
          var dfd = new dojo.Deferred();
          dfd.resolve(true);
          return dfd;
        }
      }
    };

    pageControllerMocks();
  });

  it("should create the google maps page", function() {
    allDevices(function(d) {
      pc = new PC({ device : d, baseObj : node });

      expect(t.querySelector(getRootSelector(pc))).toBeTruthy();
      expect(pc.googleMap).toBeDefined();
      expect(pc.pinInfo).toBeDefined();
    });
  });

  it("should properly pass data to the components", function() {
    allDevices(function(d) {
      pc = PC({ device : d, baseObj : node });
      expect(pc.googleMap.pins).toBe(node.googleMapPins);
    });
  });

  it("should add a pin detail component to the page for phone", function() {
    allDevices(function(d) {
      if (d.type === 'phone') {
        pc = PC({ device : d, baseObj : node });

        expect(pc.detail).toBeDefined();
        expect(pc.detail.querySelector(getRootSelector(pc.pinInfo)))
          .toBeTruthy();
      }
    });
  });

  it("should not add a pin detail component to the page for tablet", function() {
    allDevices(function(d) {
      if (d.type !== 'phone') {
        expect(pc.detail).not.toBeDefined();
      }
    });
  });

  it("should listen for the map to announce that a pin is selected", function() {
    /*
     * TODO: this is a crappy test, but I can't figure out how to "click"
     * on a pin
     */
    allDevices(function(d) {
      pc = PC({ device : d, baseObj : node });

      var pin = node.googleMapPins[0];

      spyOn(pc.pinInfo, 'set');
      pc.googleMap.onShowInfo(pin);
      expect(pc.pinInfo.set).toHaveBeenCalledWith('pin', pin);
      if (d.type === 'phone') {
        expect(dojo.hasClass(pc.detail, 'active')).toBeTruthy();
      }
    });
  });

  it("should listen for the pin info to be closed", function() {
    allDevices(function(d) {
      pc = PC({ device : devices[0], baseObj : node });

      pc.pinInfo.onClose();

      if (d.type === 'phone') {
        expect(dojo.hasClass(pc.detail, 'active')).toBeFalsy();
      }
    });
  });

  it("should not try to set up the page if the network is not available", function() {
    toura.app.Phonegap.network.isReachable = function() {
      var dfd = new dojo.Deferred();
      dfd.resolve(false);
      return dfd;
    };

    pc = PC({ device : devices[0], baseObj : node });
    spyOn(pc, '_setPin');

    expect(pc._setPin).not.toHaveBeenCalled();
    expect(pc.failure).toBeTruthy();
  });

  // NOTE: for some reason, the async nature of this test seems to mean that
  // it needs to be the last test in the suite. i am not happy about this, i
  // cannot figure out why it is, and yet, there it is.
  xit("should wait for the map to be created before trying to init the page", function() {
    var dfd = new dojo.Deferred();

    toura.app.Phonegap.network.isReachable = function() {
      setTimeout(function() { dfd.resolve(true); }, 100);
      return dfd;
    };

    pc = PC({ device : devices[0], baseObj : node });
    spyOn(pc, '_setPin');

    pc.init({
      assetId : node.googleMapPins[0].id
    });

    waitsFor(function() {
      return dfd.results;
    }, 'network reachability', 500);

    runs(function() {
      console.log('>> waiting test');
      expect(pc._setPin).toHaveBeenCalledWith(node.googleMapPins[0].id);
    });
  });
});
