describe("Toura config", function() {
  var api, obj = { foo : "bar" };

  beforeEach(function() {
    dojo.require('toura.app.Config');
    api = toura.app.Config;
    api.registerConfig({
      "testing" : "testing",
      "object" : obj
    });
  });

  it("should return the value of the requested property using the last-registered config", function() {
    expect(api.get("testing")).toBe("testing");
    expect(api.get("object")).toBe(obj);
  });

  it("should allow setting of properties", function() {
    api.set("newValue", "newValue");
    expect(api.get("newValue")).toBe("newValue");
  });
});
