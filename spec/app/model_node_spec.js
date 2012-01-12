describe("node model", function() {
  var api, node;

  beforeEach(function() {
    api = dataAPI;
    api.cache = {};
    node = api.getModel('node-home');
    dojo.publish('/tour/update'); // cache busting
  });

  it("should return assets for all known asset types", function() {
    var imagesNode = nodeForController('Images1'),
        videosNode = nodeForController('Videos1'),
        audiosNode = nodeForController('Audios1'),
        mapsNode   = nodeForController('GoogleMap1');

    var image = imagesNode.getAssetById('image', imagesNode.images[0].id),
        video = videosNode.getAssetById('video', videosNode.videos[0].id),
        audio = audiosNode.getAssetById('audio', audiosNode.audios[0].id),
        map   = mapsNode.getAssetById('google-map-pin', mapsNode.googleMapPins[0].id);

    expect(image).toBeTruthy();
    expect(image.id).toBe(imagesNode.images[0].id);

    expect(video).toBeTruthy();
    expect(video.id).toBe(videosNode.videos[0].id);

    expect(audio).toBeTruthy();
    expect(audio.id).toBe(audiosNode.audios[0].id);

    expect(map).toBeTruthy();
    expect(map.id).toBe(mapsNode.googleMapPins[0].id);
  });

  it("should return false if asked to get an asset by id that doesn't belong to the node", function() {
    var image = node.getAssetById('image', 'nonexistent');
    expect(image).toBeFalsy();
  });

  it("should not throw an error when asked to get an unknown asset type", function() {
    var asset;

    expect(function() {
      asset = node.getAssetById('unknown', 'nonexistent');
    }).not.toThrow();

    expect(asset).toBeFalsy();
  });

  it("should have the required properties", function() {
    dojo.forEach([
      'type',
      'id',
      'name',

      'headerImage',
      'backgroundImage',
      'featuredImage',

      'children',
      'bodyText',

      'images',
      'audios',
      'videos',
      'data',
      'googleMapPins',
      'feeds',

      'pageDef',
      'sharingURL',
      'parent'
    ], function(prop) {
      expect(node.hasOwnProperty(prop)).toBeTruthy();
    });
  });

  it("should have defined values for certain properties", function() {
    dojo.forEach([
      'type',
      'id',
      'name',
      'headerImage',
      'backgroundImage',

      'images',
      'audios',
      'videos',
      'data',
      'googleMapPins',
      'feeds',

      'pageDef'
    ], function(prop) {
      expect(node[prop]).toBeDefined();
    });

  });

  it("should determine the proper page def for phone", function() {
    toura.app.Config.set('device', { type : 'phone', os : 'ios' });
    expect(api.getModel('node-single_image_gallery').pageDef).toBe('images-and-text-phone');
  });

  it("should determine the proper page def for tablet", function() {
    toura.app.Config.set('device', { type : 'tablet', os : 'ios' });
    expect(api.getModel('node-single_image_gallery').pageDef).toBe('images-and-text-tablet');
  });

  it("should use the default pagedef if one is not provided", function() {
    toura.app.Config.set('device', { type : 'unknown', os : 'ios' });
    expect(api.getModel('node-single_image_gallery').pageDef).toBe('default');
  });

});

