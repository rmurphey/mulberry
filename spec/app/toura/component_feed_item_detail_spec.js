describe("feed item detail component", function() {
  var c, C, t, feed, feedItem;

  beforeEach(function() {
    dojo.require('toura.components.FeedItemDetail');

    t = dojo.byId('test');

    feedItem = {
      title : 'Feed Item Fixture',
      body : '<p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.',
      url : '/feed/fake-feed/item/0',
      link : 'http://toura.com',
      pubDate : new Date(),
      image : { url : 'http://24.media.tumblr.com/tumblr_lmx6fb2nH51qlyu3ro1_500.png' },
      author : null,
      id : 'fake-id',
      name : 'Feed Item Fixture',
      feedName : 'Fixture Feed',
      type : 'feedItem'
    };

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
    expect(dojo.hasClass(link, "hidden")).toBeFalsy();
  });

  it("should hide the link to the original feed item if there is no url", function() {
    feedItem.link = null;
    c = C({ node : feedItem });

    var link = t.querySelector('a[href="' + feedItem.link + '"]');

    expect(link).toBeTruthy();
    expect(link).toBe(c.externalLink);
    expect(dojo.hasClass(link, "hidden")).toBeTruthy();
  });

  it("should open the link to the original using child browser", function() {
    mulberry.app.PhoneGap = {
      browser : {
        url : function() { }
      }
    };

    c = C({ node : feedItem });

    var h = getEventHandler(c, 'click', c.externalLink),
        spy = spyOn(mulberry.app.PhoneGap.browser, 'url');

    expect(h).toBeDefined();

    h(fakeEventObj);
    expect(spy).toHaveBeenCalledWith(feedItem.link);
  });
});

