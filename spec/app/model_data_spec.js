describe("data asset model", function() {
  var m, M, asset, node;

  beforeEach(function() {
    node = dataAPI.getModel('text-asset-single_image_gallery');
    console.log(node);
    asset = node.data[0];
  });

  it("should create a data asset", function() {
    expect(asset).toBeDefined();
  });

  it("should properly populate the properties", function() {
    expect(asset.id).toBe('data-asset-1');
    expect(asset.name).toBe('foo data asset');
    expect(asset.type).toBe('FooDataAssetType');
    expect(asset.json.foo).toBe('bar');
  });
});
