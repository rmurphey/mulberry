describe("image gallery component", function() {
  var t, c, C, spoofRegion, config, wrapper;

  beforeEach(function() {
    dojo.require('toura.components.ImageGallery');
    mulberry.app.UI.viewport = { height: 0, width: 0 };
    
    // we don't actually create a region, so we fake the property
    // that ImageGallery needs
    spoofRegion = { width: function() { return 0; } };
    C = toura.components.ImageGallery;
    t = dojo.byId('test');

    dojo.empty(t);
  });

  it("should create a scrolling image gallery when more than one image is present", function() {
    config = {
              node : {
                url : "foo",
                images :
                [
                  {
                    "image" : {
                      "_reference" : "image-bangs"
                    },
                    "caption" : {
                      "_reference" : "text-asset-bangs"
                    },
                    "gallery" : {
                      "url" : "foo"
                    }
                  },
                  {
                    "image" : {
                      "_reference" : "image-wiry"
                    },
                    "caption" : {
                      "_reference" : "text-asset-wiry"
                    },
                    "gallery" : {
                      "url" : "bar"
                    }
                  }
                ]
              }
            };
        
    c = new C(config).placeAt(t);
    c.region = spoofRegion;
    c.startup();
    wrapper = t.querySelector('.wrapper');

    expect(t.querySelector(getRootSelector(c))).toBeTruthy();
    expect(wrapper.style.cssText).toContain("overflow");
    expect(t.querySelector('li.image')).toBeTruthy();
  });

  it("should create a non-scrolling image gallery when only one image is present", function() {
    config = {
              node : {
                url : "foo",
                images :
                [
                  {
                    "image" : {
                      "_reference" : "image-bangs"
                    },
                    "caption" : {
                      "_reference" : "text-asset-bangs"
                    },
                    "gallery" : {
                      "url" : "foo"
                    }
                  }
                ]
              }
            };
    c = new C(config).placeAt(t);
    c.region = spoofRegion;
    c.startup();
    wrapper = t.querySelector('.wrapper');

    expect(t.querySelector(getRootSelector(c))).toBeTruthy();
    expect(wrapper.style.cssText).not.toContain("overflow");
    expect(t.querySelector('li.image')).toBeTruthy();
  });

  it("should not set up any images when no images are present on the node", function() {
    config = {
              node : {
                url : "foo",
                images : []
              }
            };
    c = new C(config).placeAt(t);
    c.region = spoofRegion;
    c.startup();
    expect(t.querySelector('li.image')).toBeFalsy();
  });
});