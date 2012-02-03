describe("mulberry.model", function() {
  beforeEach(function() {
    dojo.require('mulberry._Model');
    dojo.require('mulberry._Store');
  });

  it("should create a model constructor using the provided data", function() {
    var f = false;

    mulberry.model('TestModel', {
      format : function() {
        f = true;
      }
    });

    new client.models.TestModel().format();

    expect(f).toBeTruthy();
  });

  it("should have a format function if one is not defined", function() {
    mulberry.model('TestModel');
    expect(new client.models.TestModel().format).toBeDefined();
  });
});

