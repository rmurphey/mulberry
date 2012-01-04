describe("header image model", function() {
  var api, imageObj;

  beforeEach(function() {
    dojo.require('toura.models.HeaderImage');

    api = dataAPI;
    imageObj = api.getById('image-bangs');
  });

  it("should create a header image model", function() {
    var model = new toura.models.HeaderImage(api._store, imageObj);
    dojo.forEach([
      'id',
      'name',

      'featured',
      'featuredSmall',
      'gallery',
      'original',

      'destination'
    ], function(prop) {
      expect(model[prop]).toBeDefined();
    });
  });

  it("should set a destination property if the name contains a URL", function() {
    // this is an array to simulate how the store thinks about things :/
    imageObj.name = [ 'http://google.com' ];
    var model = new toura.models.HeaderImage(api._store, imageObj);
    expect(model.destination).toBe(imageObj.name[0]);
  });
});
