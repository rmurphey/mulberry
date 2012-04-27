describe("feed model", function() {
  var f, node, store;

  beforeEach(function() {
    dojo.require('dojo.date.locale');

    node = nodeForController('FeedList');
    f = node.feeds[0];
    f.feedURL = "http://rss.cnn.com/rss/cnn_topstories.rss";
    f.throttle = -1;
    store = dataAPI._store;
    originalFeedItem = dataAPI.getById(f.id);

    mulberry.app.PhoneGap = {
      present : false,
      network : {
        isReachable : function() {
          var dfd = new dojo.Deferred();
          dfd.resolve(true);
          return dfd.promise;
        }
      }
    };

    window.localStorage.clear();
  });

  it("should create a feed model for a feed when it's on a node", function() {
    expect(f.feedUrl).toBe(store.getValue(originalFeedItem, 'feedUrl'));
    expect(f.id).toBe(store.getValue(originalFeedItem, 'id'));
    expect(f.name).toBe(store.getValue(originalFeedItem, 'name'));
    expect(f.load).toBeDefined();
  });

  it("should create a feed model for a feed when it's not on a node", function() {
    var model = dataAPI.getModel(f.id);
    expect(model.feedUrl).toBe(f.feedUrl);
    expect(model.id).toBe(f.id);
    expect(model.name).toBe(f.name);
    expect(model.load).toBeDefined();
  });

  it("should return a promise when the load method is called", function() {
    expect(f.load().then).toBeDefined();
  });

  it("should resolve the load method's promise with an array of feed items", function() {
    var items,
        feeds = ["http://techcrunch.com/feed"];

    dojo.forEach(feeds, function(feed) {
      f.feedUrl = feed;

      f.load().then(function(data) {
        items = data;
      });

      waitsFor(function() { return items; }, 3000);

      runs(function() {
        expect(items.length).toBeTruthy();
        expect(f.items).toBeDefined();

        var item = f.items[0];
        expect(item.content).toBeDefined();
        expect(item.title).toBeDefined();
        expect(item.url).toBeDefined();
        expect(item.pubDate).toBeDefined();
        expect(item.author).toBeDefined();
        expect(item.feedName).toBeDefined();
        expect(item.id).toBeDefined();
        expect(item.image).toBeDefined();
      });
    });
  });

  // TODO: Not sure why this fails
  it("should resolve the load method's promise with an empty array if there is no data", function() {
    var items;

    mulberry.feedProxyUrl = "http://localhost:3009";
    f.id = 'bad id';
    f.feedUrl = 'http://localhost:3001/ios/phone/feed-proxy/foo.json';

    f.load().then(function(data) {
      items = data;
    });

    waitsFor(function() { return items; }, 2000);

    runs(function() {
      expect(dojo.isArray(items)).toBeTruthy();
      expect(items.length).toBe(0);
    });
  });

  it("should return stored data if available if the network is not reachable", function() {
    var resolved, rejected, items;

    f.load();

    mulberry.app.PhoneGap.network.isReachable = function() {
      var dfd = new dojo.Deferred();
      dfd.resolve(false);
      return dfd.promise;
    };

    f.load().then(
      function(data) { resolved = true; items = data; },
      function() { rejected = true; }
    );

    waitsFor(function() {
      return resolved || rejected;
    }, 1000);

    runs(function() {
      expect(rejected).toBeFalsy();
      expect(resolved).toBeTruthy();
      expect(items.length).toBeDefined();
    });
  });
});
