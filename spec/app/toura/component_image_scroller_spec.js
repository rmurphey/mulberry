describe("image scroller component", function() {
  var t, C;

  beforeEach(function() {
    dojo.require('toura.components._ImageScroller');
    mulberry.app.UI.viewport = { height: 50, width: 300 };
    C = toura.components._ImageScroller;
    t = dojo.byId('test');
    dojo.empty(t);
  });

  it("should create use a scroller when at least one image is present", function() {
    var c = new C();
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
    c.scrollerNode = t;
    c.query = function(){
      return dojo.query(t);
    }
    c.postMixInProperties();
    expect(c.useScroller).toBeTruthy();

    c.images = [];
    c.postMixInProperties();
    expect(c.useScroller).toBeFalsy();
  });
});