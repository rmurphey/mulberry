describe("feed item detail component", function() {
  var c, C, t, feed, feedItem;

  beforeEach(function() {
    dojo.require('toura.components.FeedItemDetail');
    dojo.require('fixtures.feedItem');

    t = dojo.byId('test');
    feedItem = dojo.delegate(fixtures.feedItem);

    feed = {
      getItem : function() {
        return feedItem;
      }
    };

    C = function(config) {
      return new toura.components.FeedItemDetail(config || {}).placeAt(t);
    };

    if (c) { c.destroy(); }
  });

  it("should place the component on the page", function() {
    c = C({ node : feedItem });
    expect(t.querySelector(getRootSelector(c))).toBeTruthy();
  });

  it("should display the title of the feed item", function() {
    c = C({ node : feedItem });
    expect(t.innerHTML).toMatch(feedItem.title);
  });

  it("should display the full text of the feed item", function() {
    c = C({ node : feedItem });
    expect(t.innerHTML.indexOf(feedItem.body)).toBeTruthy();
  });

  it("should display the feed item image if there is one", function() {
    c = C({ node : feedItem });
    expect(t.querySelector('.image')).toBeTruthy();
  });

  it("should display a link to the original feed item", function() {
    c = C({ node : feedItem });

    var link = t.querySelector('a[href="' + feedItem.link + '"]');

    expect(link).toBeTruthy();
    expect(link).toBe(c.externalLink);
    expect(dojo.trim(link.innerHTML)).toBeTruthy();
  });

  it("should open the link to the original using child browser", function() {
    toura.app.PhoneGap = {
      browser : {
        url : function() { }
      }
    };

    c = C({ node : feedItem });

    var h = getEventHandler(c, 'click', c.externalLink),
        spy = spyOn(toura.app.PhoneGap.browser, 'url');

    expect(h).toBeDefined();

    h(fakeEventObj);
    expect(spy).toHaveBeenCalledWith(feedItem.link);
  });
});

