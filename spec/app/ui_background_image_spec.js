describe("ui background image", function() {
  var instance, bgImg, t;

  beforeEach(function() {
    dojo.require("mulberry.ui.BackgroundImage");
    t = dojo.byId('test');

    if (instance) { instance.destroy(); }

    bgImg = function(options) {
      return new mulberry.ui.BackgroundImage(options).placeAt(t);
    };
  });

  it("should not set the background image on the element if loadOnInit isn't set", function() {
    instance = bgImg({
      imageUrl : 'http://example.com/foo.jpg'
    });

    expect(
      dojo.style(t.firstChild, 'background-image')
    ).toEqual('none');

  });

  it("should set the background image on the element if loadOnInit is true", function() {
    instance = bgImg({
      imageUrl : 'http://example.com/foo.jpg',
      loadOnInit : true
    });

    expect(
      dojo.style(t.firstChild, 'background-image')
    ).toEqual('url(http://example.com/foo.jpg)');
  });

  it("should unload the image if you tell it to", function(){
    instance = bgImg({
      imageUrl : 'http://example.com/foo.jpg',
      loadOnInit : true
    });

    expect(
      dojo.style(t.firstChild, 'background-image')
    ).toEqual('url(http://example.com/foo.jpg)');

    instance.unloadImage();

    expect(
      dojo.style(t.firstChild, 'background-image')
    ).toEqual('none');

  });
});
