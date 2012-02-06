describe("pin info component", function() {
  var t, c, C, pin;

  beforeEach(function() {
    pin = {
      id : 1,
      name : 'fake name',
      address : 'fake address',
      caption : 'fake caption',
      phoneNumber : 'fakephone',
      website : 'fakewebsite'
    };

    t = dojo.byId('test');
    dojo.empty(t);

    dojo.require('toura.components.PinInfo');

    if (c) { c.destroy(); }
    C = toura.components.PinInfo;
  });

  it("should display a provided pin", function() {
    c = new C().placeAt(t);

    c.set('pin', pin);

    var h = t.innerHTML;

    expect(h).toMatch(pin.name);
    expect(h).toMatch(pin.address);
    expect(h).toMatch(pin.caption);
    expect(h).toMatch(pin.phoneNumber);
    expect(h).toMatch(pin.website);
    expect(dojo.attr(c.phoneNumberContainerNode, 'href')).toBe('tel:' + pin.phoneNumber);
  });

  it("should not require a caption to be provided for a pin", function() {
    c = new C().placeAt(t);
    delete pin.caption;
    c.set('pin', pin);

    var h = t.innerHTML;

    expect(h).toMatch(pin.name);
    expect(h).toMatch(pin.address);
    expect(h).toMatch(pin.phoneNumber);
    expect(h).toMatch(pin.website);
  });

  it("should hide the website button if there is no website for the pin", function() {
    c = new C().placeAt(t);
    var p = dojo.mixin({}, pin);
    delete p.website;
    c.set('pin', p);
    expect(dojo.hasClass(c.websiteContainerNode, 'hidden')).toBeTruthy();
  });

  it("should hide the phone number button if there is no phone number for the pin", function() {
    c = new C().placeAt(t);
    var p = dojo.mixin({}, pin);
    delete p.phoneNumber;
    c.set('pin', p);
    expect(dojo.hasClass(c.phoneNumberContainerNode, 'hidden')).toBeTruthy();
  });
});
