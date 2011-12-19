describe("_View base class", function() {
  var pc, t, v;

  beforeEach(function() {
    t = dojo.byId('test');

    dojo.require('toura._View');

    v = new toura._View({}).placeAt(t);

    pageControllerMocks();
  });

  it("should be able to hide and show itself'", function() {
    expect(v.isHidden).toBeFalsy();

    v.hide();
    expect(v.isHidden).toBeTruthy();
    expect(dojo.hasClass(v.domNode, 'hidden')).toBeTruthy();

    v.show();
    expect(v.isHidden).toBeFalsy();
    expect(dojo.hasClass(v.domNode, 'hidden')).toBeFalsy();
  });

  it("should be able to toggle its visibility", function() {
    expect(v.isHidden).toBeFalsy();

    v.toggle();
    expect(v.isHidden).toBeTruthy();
    expect(dojo.hasClass(v.domNode, 'hidden')).toBeTruthy();

    v.toggle();
    expect(v.isHidden).toBeFalsy();
    expect(dojo.hasClass(v.domNode, 'hidden')).toBeFalsy();
  });

  it("should be able to hide and show dom elements", function() {

    var d = dojo.create('div');
    v.hide(d);
    expect(dojo.hasClass(d, 'hidden')).toBeTruthy();

    v.show(d);
    expect(dojo.hasClass(d, 'hidden')).toBeFalsy();
  });


});
