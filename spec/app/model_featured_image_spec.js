describe("featured image model", function() {
  var api, imageObj, newImageObj;

  beforeEach(function() {
    dojo.require('toura.models.FeaturedImage');

    api = dataAPI;

    imageObj = api.getModel('node-grid_child_one').featuredImage;

    newImageObj = {
      "image": {
        "_reference": "image-cooper_beach"
      }
    };
  });

  it("should create a featured image model from old style data", function() {
    var model = imageObj;
    expect(model.large).toBeDefined();
    expect(model.small).toBeDefined();
    expect(model.large.url).toBeDefined();
    expect(model.small.url).toBeDefined();
  });

  it("should create a featured image model from new style data", function() {
    var model = new toura.models.FeaturedImage(api._store, newImageObj);
    expect(model).toBeDefined();
    expect(model.small).toBeDefined();
    expect(model.large.url).toBeDefined();
    expect(model.small.url).toBeDefined();
  });
});
