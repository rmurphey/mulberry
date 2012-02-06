describe("node title banner", function() {
  var t, c, C, node;

  beforeEach(function() {
    dojo.require('toura.components.NodeTitleBanner');

    t = dojo.byId('test');


    C = function(config) {
      if (c) { c.destroy(); }
      return new toura.components.NodeTitleBanner(config || {}).placeAt(t);
    };

    node = {
      featuredImage : {
        small : {
          url : 'fake-featured-image-url-small',
          width : 100,
          height : 100
        },
        large : {
          url : 'fake-featured-image-url-large',
          width : 100,
          height : 100
        }
      },

      parent : {
        name : 'parent-name'
      },

      name : 'node-name'
    };
  });

  it("should place the component on the page", function() {
    allDevices(function(d) {
      c = C({ node : node, device : d });

      var html = t.innerHTML,
          widgets = dijit.findWidgets(c.domNode);

      expect(t.querySelector(getRootSelector(c))).toBeTruthy();
      expect(html).toMatch(node.name);
      expect(html).toMatch(node.parent.name);
      expect(html).toMatch(
        node.featuredImage[ d.type === 'phone' ? 'small' : 'large' ].url
      );

      expect(widgets.filter(function(w) {
        return w.declaredClass === 'mulberry.ui.BackgroundImage';
      }).length).toBeTruthy();
    });
  });

  it("should not fail if no image is defined", function() {
    delete node.featuredImage;

    allDevices(function(d) {
      expect(function() {
        c = C({ node : node, device : d });
      }).not.toThrow();
    });
  });

  it("should not fail if no parent is defined", function() {
    delete node.parent;

    allDevices(function(d) {
      expect(function() {
        c = C({ node : node, device : d });
      }).not.toThrow();
    });
  });
});

