describe("image scroller component", function() {
  var t, c, C;

  beforeEach(function() {
    dojo.require('toura.components._ImageScroller');
    mulberry.app.UI.viewport = { height: 0, width: 0 };

    C = toura.components._ImageScroller;
    t = dojo.byId('test');
    c = new C();

    c.scrollerNode = t;
    c.query = function(){
      return dojo.query(t);
    }
  });

  it("should use a scroller when at least one image is present", function() {
    c.images = [
        {
          "image" : {
            "_reference" : "image-bangs"
          },
          "caption" : {
            "_reference" : "text-asset-bangs"
          }
        }
      ];
    c.postMixInProperties();
    expect(c.useScroller).toBeTruthy();
  });

  it("should not use a scroller when no images are present", function() {
    c.images = [];
    c.postMixInProperties();
    expect(c.useScroller).toBeFalsy();
  });
});