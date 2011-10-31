describe("containers _LayoutBox", function() {
  var c, C, t, flag;

  beforeEach(function() {
    dojo.require('toura.containers._LayoutBox');

    if (c) { c.destroy(); }

    C = function(config) {
      return new toura.containers._LayoutBox(config || {}).placeAt(t);
    };

    t = dojo.byId('test');

    dojo.declare('toura.components.FakeComponent', [], {
      placeAt : function() {
        flag = true;
      }
    });

    flag = false;
  });

  it("should create a layout box on the page", function() {
    c = C({
      config : {}
    });

    expect(t.querySelector('.layout-box')).toBeTruthy();
  });

  it("should override layout settings correctly", function() {
    c = C({
      config : {
        containerType : 'fake'
      }
    });

    var el = t.querySelector('.layout-box');
    expect(dojo.hasClass(el, 'fake-container')).toBeTruthy();
    expect(dojo.hasClass(el, 'size-flex')).toBeTruthy();
    expect(dojo.hasClass(el, 'layout-normal')).toBeTruthy();
  });

  it("should add a class if one is specified in the className property", function() {
    c = C({
      config : {
        className : 'fake'
      }
    });

    var el = t.querySelector('.layout-box');
    expect(dojo.hasClass(el, 'fake')).toBeTruthy();
  });

});
