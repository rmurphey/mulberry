describe("images page controller", function() {
  var pc, node, t, PC;

  beforeEach(function() {
    t = dojo.byId('test');
    node = nodeForController('Images1');

    if (pc) { pc.destroy(); }

    dojo.require('toura.pageControllers.node.Images1');

    PC = function(config) {
      if (pc) { pc.destroy(); }
      return new toura.pageControllers.node.Images1(config || {}).placeAt(t);
    };

    pageControllerMocks();
  });

  it("should create the images page", function() {
    dojo.forEach(devices, function(d) {
      pc = PC({ baseObj : node, device : d });
      expect(t.querySelector(getRootSelector(pc))).toBeTruthy();

      dojo.forEach([
          'nodeText',
          'caption',
          'childNodes',
          'imageGallery',
          'detail'
      ], function(ap) {
        expect(pc[ap]).toBeDefined();
      });

    });
  });

  it("should set up the image gallery", function() {
    var myNode = nodeForController('Images1', function(items) {
      return dataAPI.getModel(dojo.filter(items, function(item) {
        return item.images.length > 1;
      })[0].id[0]);
    });

    pc = PC({ baseObj : myNode, device : devices[0] });

    expect(pc.imageGallery).toBeDefined();
    expect(isWidgetRegistered('components_ImageGallery')).toBeTruthy();
    expect(t.querySelector(getRootSelector(pc.imageGallery))).toBeTruthy();
  });


  it("should pass the proper data to the components", function() {
    dojo.forEach(devices, function(d) {
      pc = PC({ baseObj : node, device : d });

      expect(pc.imageGallery.images.length).toBe(node.images.length);
      expect(pc.detail.images.length).toBe(node.images.length);
      expect(pc.childNodes.children).toBe(node.children);
      var caption = node.images[0].caption;
      expect(pc.imageGallery.images[0].caption).toBe(caption);
      expect(pc.caption.bodyText).toBe(caption);
      expect(pc.nodeText.bodyText).toBe(node.bodyText.body);
    });
  });

  it("should accept initialization arguments", function() {
    var myNode = nodeForController('Images1', function(items) {
      return dataAPI.getModel(dojo.filter(items, function(item) {
        return item.images.length > 1;
      })[0].id[0]);
    });

    pc = PC({
      baseObj : myNode,
      device : devices[1]
    });

    dojo.publish('/page/transition/end');

    pc.init({
      assetId : myNode.images[1].id,
      assetType : 'images'
    });

    expect(pc.caption.domNode.innerHTML).toMatch(myNode.images[1].caption);
  });

  describe('component event brokering', function() {
    var myNode, pc;

    beforeEach(function() {
      myNode = nodeForController('Images1', function(items) {
        return dataAPI.getModel(dojo.filter(items, function(item) {
          return item.images.length > 1;
        })[0].id[0]);
      });
      pc = PC({
        baseObj : myNode,
        device : devices[1]
      });

      pc.init();
    });

    it("should respond when image detail is shown", function() {
      dojo.publish('/page/transition/end');

      spyOn(pc.detail, 'set').andCallThrough();
      pc.imageGallery.onShowDetail(1);
      expect(pc.detail.set).toHaveBeenCalledWith('active', true);
      expect(pc.detail.set).toHaveBeenCalledWith('currentImageIndex', 1);
    });

    it("should respond when image detail is hidden", function() {
      dojo.publish('/page/transition/end');

      spyOn(pc.imageGallery, 'set').andCallThrough();
      spyOn(pc.imageGallery, 'scrollToIndex').andCallThrough();
      spyOn(pc.caption, 'set').andCallThrough();
      pc.detail.onHideDetail(0);
      expect(pc.imageGallery.set).toHaveBeenCalledWith('active', true);
      expect(pc.imageGallery.scrollToIndex).toHaveBeenCalledWith(0);
      expect(pc.caption.set).toHaveBeenCalledWith('content', myNode.images[0].caption);
    });

    it("should respond when scroll ends", function() {
      spyOn(pc.caption, 'set').andCallThrough();
      pc.imageGallery.onScrollEnd();
      expect(pc.caption.set).toHaveBeenCalledWith('content', '');
    });

  });

});
