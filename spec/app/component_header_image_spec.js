describe("header image component", function() {
  var c, C, t, img, node;

  beforeEach(function() {
    t = dojo.byId('test');

    dojo.require('toura.components.HeaderImage');

    C = function(config) {
      if (c) { c.destroy(); }
      return new toura.components.HeaderImage(config || {}).placeAt(t);
    };

    img = img || dataAPI.getModel('node-grid').phoneHeaderImage;

    toura.app.UI.viewport = {
      width : 100,
      height : 100
    };

    node = dataAPI.getModel('node-grid');
  });

  it("should set up the component", function() {
    allDevices(function(d) {
      var myImg = node.headerImage[d.type],
          size = d.type === 'phone' ? 'gallery' : 'original';

      c = C({ device : d, node : node });

      expect(t.querySelector(getRootSelector(c))).toBeTruthy();
      expect(isWidgetRegistered('components_HeaderImage')).toBeTruthy();
      expect(c.viewImage).toBeDefined();
      expect(c.image).toBe(myImg[size]);
      expect(t.querySelector('img[src="' + myImg[size].url + '"]')).toBeTruthy();
    });
  });

  it("should not render anything if there is no header image on the node", function() {
    allDevices(function(d) {
      c = C({ device : d, node : {} });
      c.startup();

      expect(
        t.querySelector(getRootSelector(c))
      ).toBeFalsy();
    });
  });

  it("should be tolerant of a node without a header image", function() {
    var myNode = dojo.mixin({}, node);
    myNode.headerImage = {
      phone : null,
      tablet : null
    };

    allDevices(function(d) {
      expect(function() {
        c = C({ device : d, node : node });
      }).not.toThrow();
    });
  });

  it("should make itself clickable if the header image has a destination property", function() {
    node.headerImage.phone.destination = 'foo';
    node.headerImage.tablet.destination = 'foo';

    toura.app.PhoneGap = {
      browser : {
        url : function() { }
      }
    };

    var spy = spyOn(toura.app.PhoneGap.browser, 'url');

    allDevices(function(d) {
      c = C({ device : d, node : node });

      var h = getEventHandler(c, 'click', c.domNode);

      expect(h).toBeTruthy();
      h();
      expect(spy).toHaveBeenCalledWith('foo');
    });
  });
});
