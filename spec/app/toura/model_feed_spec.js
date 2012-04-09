describe("feed model", function() {
  var f, node, store;

  beforeEach(function() {
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

  /* TODO: This is removed pending better integration with Travis-CI */
  it("should resolve the load method's promise with an array of feed items", function() {
    var items,
        feeds = ["http://localhost:3001/ios/phone/feed-proxy/techcrunch.json"];
    console.log('feeds', feeds);

    dojo.forEach(feeds, function(feed) {
      f.feedURL = feed;

      f.load().then(function(data) {
        items = data;
      });

      waitsFor(function() { return items; }, 3000);

      runs(function() {
        expect(items.length).toBeTruthy();
        expect(f.items).toBeDefined();

        var item = f.items[0];
        expect(item.type).toBe('feedItem');
        expect(item.body).toBeDefined();
        expect(item.title).toBeDefined();
        expect(item.url).toBeDefined();
        expect(item.link).toBeDefined();
        expect(item.pubDate).toBeDefined();
        expect(item.name).toBeDefined();
        expect(item.feedName).toBeDefined();
        expect(item.id).toBeDefined();
        expect(item.author).toBeDefined();
        expect(item.image).toBeDefined();
      });
    });
  });

  it("should resolve the load method's promise with an empty array if there is no data", function() {
    var items;

    f.id = 'bad id';
    f.feedUrl = 'bad url';

    f.load().then(function(data) {
      items = data;
    });

    waitsFor(function() { return items; }, 1000);

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

  it('should read the media attribute off an MRSS feed', function() {
    var videoFeedItem,
        mediaType = 'video/mp4',
        mediaUrl = "http://release.theplatform.com/release/content.mp4?pid=n49nIyLbpuGzkWqaaNioX_v_eistztjf&UserName=Unknown&Portal=Toura%20-%20POC%20-%20LowQualityDownload&Metafile=false",
        videoFeedItemFixture = {
          content : {
            bitrate : '163',
            duration : '108',
            fileSize : '2218863',
            height : '224',
            identifier : "http://mps.theplatform.com/data/Release/2212718327",
            profile : 'Mobile Standard',
            type : mediaType,
            url : mediaUrl,
            width: "400"
          },
          description : "We're in for a mostly sunny and windy day, with more record warmth on the way!  High of 83 this afternoon.",
          guid : {
            content : "http://mps.theplatform.com/data/Content/2212717472",
            isPermalink : "false"
          },
          index : 0,
          modified : "Tue, 20 Mar 2012 13:15:52 GMT",
          player : {
            height : "204",
            url : "http://release.theplatform.com/content.select?pid=n49nIyLbpuGzkWqaaNioX_v_eistztjf&UserName=Unknown&Portal=Toura%20-%20POC%20-%20LowQualityDownload",
            width : "272"
          },
          pubDate : "Tue, 20 Mar 2012 13:11:38 GMT",
          restriction: {
            content : "all",
            relationship : "allow",
            type : "country"
          },
          thumbnail : {
            url : "http://media.NBCChicago.com/assets/video/NBCU_LM_Prod_-_WMAQ/17/177/Copyofsunny.jpg"
          },
          title : "NBC 5 WEATHER VIDEO MAR 20 MORNING"
        };

    videoFeedItem = toura.models.FeedItem(videoFeedItemFixture, { id : 'hi' });

    expect(videoFeedItem.media.url).toEqual(mediaUrl);
    expect(videoFeedItem.media.type).toEqual(mediaType);
  });
});
