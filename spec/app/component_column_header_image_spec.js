describe("column header image component", function() {
  var c, C, t, node;

  beforeEach(function() {
    t = dojo.byId('test');

    dojo.require('toura.components.ColumnHeaderImage');

    C = function(config) {
      if (c) { c.destroy(); }
      return new toura.components.ColumnHeaderImage(config || {}).placeAt(t);
    };

    mulberry.app.UI.viewport = {
      width : 100,
      height : 100
    };

    node = nodeForController('FeedList');
  });

  it("should set up the component", function() {
    allDevices(function(d) {
      c = C({ device : d, node : node });
      expect(dojo.hasClass(c.domNode, 'column-header-image')).toBeTruthy();
    });
  });

  it("should resize the image based on its container", function() {
    allDevices(function(d) {
      dojo.style(t, { width : '100px' }) ;

      c = C({ device : d, node : node });
      c.startup();

      expect(
        dojo.style(c.imageNode, 'width')
      ).toEqual(dojo.style(t, 'width'));

      dojo.style(t, { width : '200px' }) ;
      dojo.publish('/window/resize');

      expect(
        dojo.style(c.imageNode, 'width')
      ).toEqual(dojo.style(t, 'width'));
    });
  });
});
