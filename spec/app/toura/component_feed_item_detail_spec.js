describe("feed item detail component", function() {
  var c, C, t, feed, feedItem, videoFeed, videoFeedItem, feedMedia = {
    type : 'video/mp4',
    url : 'http://av.vimeo.com/01780/039/24113681.web?token=1331829715_b4a96dbd1013cbcb9d316abbce7fbc0e'
  };

  beforeEach(function() {
    dojo.require('toura.components.FeedItemDetail');

    t = dojo.byId('test');

    feedItem = {
      title : 'Feed Item Fixture',
      content : '<p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.',
      url : '/feed/fake-feed/item/0',
      link : 'http://toura.com',
      pubDate : new Date(),
      image : 'http://24.media.tumblr.com/tumblr_lmx6fb2nH51qlyu3ro1_500.png',
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

    videoFeedItem = dojo.clone(feedItem);
    videoFeedItem.title = 'Video Feed Item Fixture';
    videoFeedItem.video = feedMedia;

    videoFeed = {
      getItem : function() {
        return videoFeedItem;
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

  it("should hide the video player if there's no video", function() {
    c = C({ node : feedItem });
    expect(dojo.hasClass(t.querySelector('.component.video-player'), 'hidden')).toBeTruthy();
  });

  it("should show the video player if there is a video", function() {
    c = C({ node : videoFeedItem });
    expect(dojo.hasClass(t.querySelector('.component.video-player'), 'hidden')).toBeFalsy();
  });

  it("should hide and show the video player based on the feed item", function() {
    c = C({ node : feedItem });
    expect(dojo.hasClass(t.querySelector('.component.video-player'), 'hidden')).toBeTruthy();
    c.set('item', videoFeedItem);
    expect(dojo.hasClass(t.querySelector('.component.video-player'), 'hidden')).toBeFalsy();
    c.set('item', feedItem);
    expect(dojo.hasClass(t.querySelector('.component.video-player'), 'hidden')).toBeTruthy();
  });

  it("should display the correct video", function() {
    var videoLoadStart = false;

    c = C({ node : videoFeedItem });

    c.videoPlayer._setupPlayer();

    dojo.connect(c.videoPlayer.player, 'loadstart', this, function() {
      videoLoadStart = true;
    });

    waitsFor(function() {
      return videoLoadStart;
    }, "Player never loaded", 1000);

    runs( function() {
      expect(t.querySelector('.component.video-player video').getAttribute('src')).toEqual(feedMedia.url);
    });
  });
});

