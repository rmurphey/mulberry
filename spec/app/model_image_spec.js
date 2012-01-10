describe("image model", function() {
  var api, imageObj;

  beforeEach(function() {
    dojo.require('toura.models.Image');

    api = dataAPI;
    imageObj = api.getById('node-image_gallery').images[0];
  });

  it("should create an image model", function() {
    var model = new toura.models.Image(api._store, imageObj);
    dojo.forEach([
      'id',
      'name',
      'caption',
      'height',
      'width'
    ], function(prop) {
      expect(model[prop]).toBeDefined();
    });
  });

  it("should set the attributes correctly", function(){
    var model = new toura.models.Image(api._store, imageObj);
	dojo.forEach([
	  'featured',
	  'featuredSmall',
	  'gallery',
	  'original'
	], function(style) {
	  expect(model[style].height).toBe(160);
	  expect(model[style].width).toBe(240);
	});

  });
});