describe("featured image model", function() {
  var api, imageObj, oldImageObj;

  beforeEach(function() {
    dojo.require('toura.models.FeaturedImage');

    api = dataAPI;

    oldImageObj = { 
      "_reference" : "image-cooper_beach" 
    };

    imageObj = api.getModel('node-grid_child_one').featuredImage;
  });
  
  /* TODO: come up with a good way of testing MAP-style data */
  xit("should create a featured image model from old style data", function() {
    var model = new toura.models.FeaturedImage(api._store, oldImageObj);
    expect(model.large).toBeDefined();
    expect(model.small).toBeDefined();
    expect(model.large.url).toBeDefined();
    expect(model.small.url).toBeDefined();
  });

  it("should create a featured image model from new style data", function() {
    var model = imageObj;
    expect(model).toBeDefined();
    expect(model.small).toBeDefined();
    expect(model.large.url).toBeDefined();
    expect(model.small.url).toBeDefined();
  });
});
