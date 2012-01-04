describe("data asset model", function() {
  var m, M, asset, node;

  beforeEach(function() {
    node = dataAPI.getModel('node-grid');
    asset = node.data[0];
  });

  it("should create a data asset", function() {
    expect(asset).toBeDefined();
  });

  it("should properly populate the properties", function() {
    expect(asset.id).toBe('data-asset-test');
    expect(asset.name).toBe('test');
    expect(asset.type).toBe('FooDataAsset');
    expect(asset.json.foo).toBe('bar');
  });
});
