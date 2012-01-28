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

  describe("template string replacement", function() {
    var hamlTemplate = '.foo\n  .bar= baz',
        mustacheTemplate = '<div class="foo"><div class="bar">{{baz}}</div></div>',
        viewSettings = {
          baz : 'teststring'
        };

    beforeEach(function() {
      dojo.empty(t);
    });

    it("should properly handle a Haml template", function() {
      var v = new toura._View(dojo.mixin(viewSettings, {
        templateString : hamlTemplate
      })).placeAt(t);

      expect(t.innerHTML).toMatch('teststring');
      expect(t.querySelector('.bar')).toBeTruthy();
      expect(t.querySelector('.foo')).toBeTruthy();
    });

    it("should properly handle a Mustache template", function() {
      var v = new toura._View(dojo.mixin(viewSettings, {
        templateString : mustacheTemplate
      })).placeAt(t);

      expect(t.innerHTML).toMatch('teststring');
      expect(t.querySelector('.bar')).toBeTruthy();
      expect(t.querySelector('.foo')).toBeTruthy();
    });
  });
});
