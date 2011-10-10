describe("featured image model", function() {
  var api, imageObj;

  beforeEach(function() {
    dojo.require('toura.models.FeaturedImage');

    api = dataAPI;
    imageObj = api.getById('image-540');
  });

  it("should create a featured image model", function() {
    var model = new toura.models.FeaturedImage(api._store, imageObj);
    expect(model.large).toBeDefined();
    expect(model.small).toBeDefined();
    expect(model.large.url).toBeDefined();
    expect(model.small.url).toBeDefined();
  });
});
