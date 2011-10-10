describe("local data api", function() {
  var api;

  beforeEach(function() {
    dojo.require('toura.app.Local');
    api = toura.app.Local;
  });

  it("should return a deferred when fetching the manifest", function() {
    expect(api.manifest().promise).toBeDefined();
  });

  it("should return a promise when fetching the template definintions", function() {
    expect(api.templates().promise).toBeDefined();
  });

});
