describe("containers _LayoutBox", function() {
  var c, C, t, flag;

  beforeEach(function() {
    dojo.require('mulberry.containers._LayoutBox');

    if (c) { c.destroy(); }

    C = function(config) {
      return new mulberry.containers._LayoutBox(config || {}).placeAt(t);
    };

    t = dojo.byId('test');

    dojo.declare('mulberry.components.FakeComponent', [], {
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
