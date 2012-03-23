describe("viewport container", function() {
  var t, c, C;

  beforeEach(function() {
    dojo.require('mulberry.containers.Viewport');
    dojo.require('mulberry._Component');

    t = dojo.byId('test');
    dojo.empty(t);

    mulberry.app.UI = {
      viewport : { width : 100, height :100 }
    };

    if (c) { c.destroy(); }

    C = function(config) {
      return new mulberry.containers.Viewport(config || {});
    };

    c = new mulberry.containers.Viewport().placeAt(t);
  });

  it("should create a viewport object", function() {
    expect(t.querySelector('.viewport')).toBeTruthy();
  });

  it("should allow setting the nav direction", function() {
    c.set('navDirection', 'back');
    expect(c.direction).toBe('prev');
    c.set('navDirection', 'something else');
    expect(c.direction).toBe('next');
  });

  it("should allow setting its content", function() {
    c.set('content', new mulberry._Component({ "class" : "fake-component" }));
    expect(t.querySelector('.viewport .fake-component')).toBeTruthy();
  });

  describe("animation", function() {
    it("should ensure that its width is the width of the viewport on animation end", function() {
      dojo.style(c.domNode, { width : '500px' });
      c.set('content', new mulberry._Component());
      expect(c.domNode.style.width).toBe(mulberry.app.UI.viewport.width + 'px');
    });
  });
});
