describe("audios page controller", function() {
  var pc, node, t, PC;

  beforeEach(function() {
    t = dojo.byId('test');
    node = nodeForController('Audios1');

    if (pc) { pc.destroy(); }

    dojo.require('toura.pageControllers.node.Audios1');

    PC = function(config) {
      if (pc) { pc.destroy(); }
      return new toura.pageControllers.node.Audios1(config || {}).placeAt(t);
    };

    pageControllerMocks();
  });

  it("should create the audios page", function() {
    allDevices(function(d) {
      pc = PC({ baseObj : node, device : d });
      expect(t.querySelector(getRootSelector(pc))).toBeTruthy();

      dojo.forEach([
        'audioPlayer',
        'imageGallery',
        'detail',
        'childNodes',
        'bodyText'
      ], function(ap) {
        expect(pc[ap]).toBeDefined();
      });

      if (d.type !== 'phone') {
        expect(pc.imageCaption).toBeDefined();
      }
    });
  });

  describe("conditional asset list", function(){

    it("should not set up the audio asset list if only one audio", function() {
      pc = PC({ baseObj : node });
      expect(isWidgetRegistered('components_AssetList')).toBeFalsy();
    });

    it("should set up the audio asset list if more than one audio", function() {
      var myNode = nodeForController('Audios1', function(items) {
        return dataAPI.getModel(dojo.filter(items, function(item) {
          return item.audios.length > 1;
        })[0].id[0]);
      });

      pc = PC({ baseObj : myNode });

      expect(pc.audioList).toBeDefined();
      expect(isWidgetRegistered('components_AudioList')).toBeTruthy();
      expect(t.querySelector(getRootSelector(pc.audioList))).toBeTruthy();

      expect(t.querySelector(getRootSelector(pc.audioList)).innerHTML)
        .toMatch(myNode.audios[0].name);
      expect(t.querySelector(getRootSelector(pc.audioList)).innerHTML)
        .toMatch(myNode.audios[1].name);
    });

  });

  it("should pass the proper data to the components", function() {
    allDevices(function(d) {
      pc = PC({ baseObj : node });

      expect(pc.audioPlayer.medias.length).toBe(node.audios.length);
      expect(pc.imageGallery.images.length).toBe(node.images.length);
      expect(pc.detail.images.length).toBe(node.images.length);
      expect(pc.childNodes.children).toBe(node.children);
      expect(pc.audioCaption.bodyText).toBe(node.audios[0].caption);
      expect(pc.bodyText.bodyText).toBe('');

      if (d.type !== 'phone') {
        expect(pc.imageCaption.bodyText).toBe(node.images[0].caption);
      }
    });
  });

  it("should put the proper content on the page", function() {
    allDevices(function(d) {
      pc = PC({ baseObj : node });

      dojo.publish('/page/transition/end');

      if (d.os !== 'android') {
        expect(pc.audioPlayer.player.src).toBe(node.audios[0].url);
      }

      dojo.forEach(node.children, function(c) {
        expect(pc.childNodes.domNode.innerHTML).toMatch(c.name);
      });

      expect(
        dijit.byNode(pc.imageGallery.imageList.firstChild.firstChild)
          .imageUrl
      ).toBe(node.images[0].gallery.url);

      expect(
        dijit.byNode(pc.detail.imageList.firstChild.firstChild)
          .imageUrl
      ).toBe(node.images[0][d.type === 'phone' ? 'gallery' : 'original'].url);

      expect(pc.audioCaption.domNode.innerHTML).toMatch(node.audios[0].caption);

      if (d.type !== 'phone') {
        expect(pc.imageCaption.domNode.innerHTML).toMatch(node.images[0].caption);
      }
    });
  });

  it("should accept initialization arguments", function() {
    allDevices(function(d) {
      var myNode = nodeForController('Audios1', function(items) {
        return dataAPI.getModel(dojo.filter(items, function(item) {
          return item.audios.length > 1;
        })[0].id[0]);
      });

      pc = PC({ baseObj : myNode });

      dojo.publish('/page/transition/end');

      pc.init({
        assetId : myNode.audios[1].id,
        assetType : 'audios'
      });

      expect(pc.audioList.domNode.querySelector('.current')).toBeTruthy();
      expect(pc.audioList.currentAsset).toBe(myNode.audios[1].id);

      if (d.os !== 'android') {
        expect(pc.audioPlayer.player.src).toBe(myNode.audios[1].url);
      }

      expect(pc.audioCaption.domNode.innerHTML).toMatch(myNode.audios[1].caption);
    });
  });

  it("should respond when an item is chosen from the asset list", function() {
    var myNode = nodeForController('Audios1', function(items) {
      return dataAPI.getModel(dojo.filter(items, function(item) {
        return item.audios.length > 1;
      })[0].id[0]);
    });

    pc = PC({
      baseObj : myNode,
      device : devices[1]
    });

    dojo.publish('/page/transition/end');

    spyOn(pc.audioPlayer, 'play');

    pc.audioList.onSelect(myNode.audios[1].id);

    expect(pc.audioPlayer.play).toHaveBeenCalledWith(myNode.audios[1].id);
    expect(pc.audioCaption.domNode.innerHTML).toMatch(myNode.audios[1].caption);
  });

});
