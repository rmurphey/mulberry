describe("feed item list component", function() {
  var c, C, node, feedItems, t;

  beforeEach(function() {
    dojo.require('toura.components.FeedItemList');

    t = dojo.byId('test');

    C = function(config) {
      return new toura.components.FeedItemList(config || {}).placeAt(t);
    };

    if (c) { c.destroy(); }

    feedItems = [
      {
        title : 'Item 1 Title',
        content : '<p>This is the body of item 1</p>',
        link : 'http://toura.com',
        author : 'Rebecca Murphey',
        pubDate : new Date(),
        image : false
      },
      {
        title : 'Item 2 Title',
        content : 'This is the body of item 2',
        link : 'http://google.com',
        author : false,
        pubDate : new Date(),
        image : 'http://24.media.tumblr.com/tumblr_lmx6fb2nH51qlyu3ro1_500.png'
      }
    ];

    feedLoad = function() {
      var dfd = new dojo.Deferred();
      this.items = feedItems;
      dfd.resolve(feedItems);
      return dfd.promise;
    };

    node = {
      feeds : [
        {
          id : 'feed-1',
          load : feedLoad,
          updated : '2011-06-23T13:42:30Z'
        },

        {
          id : 'feed-2',
          load : feedLoad,
          updated : '2011-06-23T13:42:30Z'
        }
      ]
    };
  });

  it("should place the component on the page", function() {
    c = C({ node : node });
    expect(t.querySelector(getRootSelector(c))).toBeTruthy();
  });

  it("should use the first feed associated with the node", function() {
    c = C({ node : node });
    expect(c.feed.id).toBe(node.feeds[0].id);
  });

  it("should fail gracefully if no feeds are associated with the node", function() {
    delete node.feeds;

    expect (function() {
      c = C({ node : node });
    }).not.toThrow();
  });

  it("should load the feed if one is present", function() {
    var spy = spyOn(node.feeds[0], 'load').andCallThrough();

    c = C({ node : node });
    c.startup();
    expect(spy).toHaveBeenCalled();
  });

  it("should populate the component with items from the feed", function() {
    var flag;

    c = C({ node : node });
    c.startup();

    expect(t.innerHTML).toMatch(feedItems[0].title);
    // expect(t.innerHTML).toMatch(feedItems[0].pubDate);

    expect(t.innerHTML).toMatch(feedItems[1].title);
    expect(t.innerHTML).toMatch(feedItems[1].image.url);
  });

  it("should indicate when the feed was last updated", function() {
    c = C({ node : node });

    expect(t.innerHTML).toBeTruthy();
    expect(t.innerHTML).not.toBe('undefined');
  });

  it("should render an image for a feed item if one is present", function() {
    c = C({ node : node });
    c.startup();
    expect(t.innerHTML).toMatch(feedItems[1].image.url);
  });

  it("should announce when a user selects an item", function() {
    mulberry.app.UI.hasTouch = true;

    c = C({ node : node });
    c.startup();

    var spy = spyOn(c, 'onSelect'),
        handler = getEventHandler(c, 'touchend', c.feedItemList);

    handler({
      preventDefault : function() { },
      target : c.feedItemList.querySelector('li > *')
    });

    expect(spy).toHaveBeenCalledWith(c.feed.id, '0');
  });

  it("should not announce a selection if the list has been moved", function() {
    mulberry.app.UI.hasTouch = true;

    c = C({ node : node });
    c.startup();

    var spy = spyOn(c, 'onSelect'),
        touchmoveHandler = getEventHandler(c, 'touchmove', c.feedItemList),
        touchendHandler = getEventHandler(c, 'touchend', c.feedItemList);

    touchmoveHandler();

    touchendHandler({
      preventDefault : function() { },
      target : c.feedItemList.querySelector('li > *')
    });

    expect(spy).not.toHaveBeenCalled();
  });
});
