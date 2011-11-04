describe("featured image model", function() {
  var api, imageObj, newImageObj;

  beforeEach(function() {
    dojo.require('toura.models.FeaturedImage');

    api = dataAPI;

    imageObj = api.getById('image-540');

    newImageObj = {
      "image": {
        "_reference": "image-540"
      }
    };
  });

  it("should create a featured image model from old style data", function() {
    var model = new toura.models.FeaturedImage(api._store, imageObj);
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
