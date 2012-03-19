describe("video player component", function() {
  var t, C,
      config = {
        node : {
          videos : [
            {
              "video" : {
                "_reference": "video-baby_owls"
              }
            },
            {
              "caption": {
                "_reference": "text-asset-baby_owls"
              }
            }
          ]
        }
      },
      feed_media = {
        url: 'http://av.vimeo.com/01780/039/24113681.web?token=1331829715_b4a96dbd1013cbcb9d316abbce7fbc0e'
      };

  beforeEach(function() {
    dojo.require('toura.components.VideoPlayer');

    C = toura.components.VideoPlayer;

    t = dojo.byId('test');
    dojo.empty(t);
  });

  it("should create a video player", function() {
    var c = new C(config).placeAt(t);
    expect(t.querySelector(getRootSelector(c))).toBeTruthy();
  });
  
  it("should change its media when prompted", function() {
    var c = new C(config).placeAt(t);

    c.startup();
    c.set('media', {url: 'foo'});
    c._setupPlayer();
    c.set('media', feed_media);
    
    waits(250);
    
    runs( function() {
      expect(t.querySelector('video').getAttribute('src')).toEqual(feed_media.url);
    });
    
  });

  it("should destroy the component when it doesn't have any videos", function() {
    var config = {
          node : {
            videos : []
          }
        },
        c = new C(config).placeAt(t);

    c.startup();
    expect(t.querySelector('.component.video-player')).toBeFalsy();
  });
});
