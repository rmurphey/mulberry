describe("image gallery component", function() {
  var t, c, C, config, wrapper;

  beforeEach(function() {
    dojo.require('toura.components.ImageGallery');
    mulberry.app.UI.viewport = { height: 0, width: 0 };

    C = toura.components.ImageGallery;
    t = dojo.byId('test');

    dojo.empty(t);
  });

  it("should create a scrolling image gallery when more than one image is present", function() {
    var wrapper;
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
    c.startup();
    wrapper = t.querySelector('.wrapper');
    expect(wrapper.style.cssText).toContain("overflow");
  });

  it("should not create a scrolling image gallery when only one image is present", function() {
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
    c.startup();
    wrapper = t.querySelector('.wrapper');
    expect(wrapper.style.cssText).not.toContain("overflow");
  });
});