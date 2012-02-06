describe("google map component", function() {
  var t, c, C, pins;

  beforeEach(function() {
    t = dojo.byId('test');

    dojo.require('toura.components.GoogleMap');

    C = function(config) {
      if (c) { c.destroy(); }
      return new toura.components.GoogleMap(config).placeAt(t);
    };

    pins = pins || nodeForController('GoogleMap1').googleMapPins;
  });


  // everything is tested in this one test, because adding more tests
  // makes the Google Maps API choke on the asynchronicity of it all :(
  xit("should set up the component", function() {
    c = C({ node : { googleMapPins : pins }});

    expect(t.querySelector(getRootSelector(c))).toBeTruthy();
    expect(isWidgetRegistered('components_GoogleMap')).toBeTruthy();
    expect(c.isBuilt).toBeFalsy();

    dojo.connect(c, '_buildMap', function() {
      spyOn(c, '_doQueue');
      spyOn(c, 'onShowInfo');

      expect(window.google.maps).toBeDefined();
      expect(c.map).toBeDefined();
      expect(c.markers).toBeDefined();
      expect(c.markers.length).toBe(pins.length);
      expect(c.isBuilt).toBeTruthy();

      c.set('pin', pins[0].id);
      expect(c.pin).toBe(pins[0]);

      expect(c.onShowInfo).toHaveBeenCalled();
      expect(c._doQueue).toHaveBeenCalled();
    });
  });
});
