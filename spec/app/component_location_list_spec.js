describe("location list", function() {
  var c, C, t, node;

  beforeEach(function() {
    dojo.require('toura.components.LocationList');

    t = dojo.byId('test');

    C = function(config) {
      if (c) { c.destroy(); }
      return new toura.components.LocationList(config || {}).placeAt(t);
    };

    node = nodeForController('LocationList');

    toura.app.PhoneGap = {
      browser : {
        url : function() { }
      }
    };

  });

  it("should set up the component", function() {
    allDevices(function(d) {
      c = C({ node : node, device : d });

      var html = t.innerHTML,
          loc = node.googleMapPins[0];

      expect(t.querySelector(getRootSelector(c))).toBeTruthy();
      expect(html).toMatch(loc.name);
      expect(html).toMatch(loc.address);
    });
  });

  it("should render directions buttons", function() {
    allDevices(function(d) {
      c = C({ node : node, device : d });

      var directionsButtons = t.querySelectorAll('.directions');

      expect(directionsButtons.length).toBe(node.googleMapPins.length);
      expect(directionsButtons[0].href).toBe(
        toura.app.URL.googleMapAddress(node.googleMapPins[0].address)
      );

      expect(directionsButtons[0].target).toBe('_blank');
    });
  });

  it("should render a phone button for locations with phone number data", function() {
    node.googleMapPins[0].phoneNumber = '9195551212';

    allDevices(function(d) {
      c = C({ node : node, device : d });

      var phoneButtons = t.querySelectorAll('.phone-number');

      expect(phoneButtons.length).toBe(
        node.googleMapPins.filter(function(pin) {
          return !!pin.phoneNumber;
        }).length
      );

      expect(dojo.attr(phoneButtons[0], 'href')).toBe(
        toura.app.URL.tel(node.googleMapPins[0].phoneNumber)
      );
    });
  });

  it("should render a website button for locations with website data", function() {
    node.googleMapPins[0].website = 'http://toura.com';

    allDevices(function(d) {
      c = C({ node : node, device : d });

      var websiteButtons = t.querySelectorAll('.website');

      expect(websiteButtons.length).toBe(
        node.googleMapPins.filter(function(pin) {
          return !!pin.website;
        }).length
      );

      expect(dojo.attr(websiteButtons[0], 'href')).toBe(node.googleMapPins[0].website);
    });
  });

  it("should open website links in child browser", function() {
    var events = getEventHandlers(c, 'click');
    var spy = spyOn(toura.app.PhoneGap.browser, 'url');

    events[0](fakeEventObj);
    expect(spy).toHaveBeenCalledWith(
      node.googleMapPins.filter(function(pin) {
        return !!pin.website;
      })[0].website
    );
  });
});
