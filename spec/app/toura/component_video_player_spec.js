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
