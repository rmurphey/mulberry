describe("page header image component", function() {
  var c, C, t, node;

  beforeEach(function() {
    t = dojo.byId('test');

    dojo.require('toura.components.PageHeaderImage');

    C = function(config) {
      if (c) { c.destroy(); }
      return new toura.components.PageHeaderImage(config || {}).placeAt(t);
    };

    toura.app.UI.viewport = {
      width : 100,
      height : 100
    };

    node = dataAPI.getModel("node-grid");
  });

  it("should set up the component", function() {
    allDevices(function(d) {
      c = C({ device : d, node : node });
      expect(dojo.hasClass(c.domNode, 'page-header-image')).toBeTruthy();
    });
  });

  it("should calculate the image dimensions based on the viewport", function() {
    allDevices(function(d) {
      toura.app.UI.viewport.width = 100;
      c = C({ device : d, node : node });
      expect(parseInt(dojo.attr(c.imageNode, 'width'), 10)).toBe(toura.app.UI.viewport.width);

      spyOn(c, '_calculateDimensions').andCallThrough();

      toura.app.UI.viewport.width = 200;
      dojo.publish('/window/resize');

      expect(c._calculateDimensions).toHaveBeenCalled();
      expect(parseInt(dojo.attr(c.imageNode, 'width'), 10)).toBe(toura.app.UI.viewport.width);
    });
  });
});
