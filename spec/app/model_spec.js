describe("toura.model", function() {
  beforeEach(function() {
    dojo.require('toura._Model');
    dojo.require('toura._Store');
  });

  it("should create a model constructor using the provided data", function() {
    var f = false;

    toura.model('TestModel', {
      format : function() {
        f = true;
      }
    });

    new client.models.TestModel().format();

    expect(f).toBeTruthy();
  });

  it("should have a format function if one is not defined", function() {
    toura.model('TestModel');
    expect(new client.models.TestModel().format).toBeDefined();
  });
});

