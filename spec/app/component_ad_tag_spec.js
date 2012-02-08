describe("ad tag component", function() {
  var t, C, c, node, adCfg;

  beforeEach(function() {
    dojo.require('toura.components.AdTag');
    t = dojo.byId('test');
    qs = dojo.hitch(t, 'querySelector');
    adCfg = {
      ads : {
        phone : 'foo',
        tablet : 'bar'
      }
    };
    toura.app.Config.set("app", adCfg);

    if (c) { c.destroy(); }
    C = function(config) {
      return new toura.components.AdTag(config || {}).placeAt(t);
    };
  });

  it("should place the component on the page", function() {
    c = C();
    expect(qs(getRootSelector(c))).toBeTruthy();
    expect(c.adFrame).toBeDefined();
  });

  it("should set the src of the iframe from toura.app.Config", function() {
    allDevices(function(d) {
      c = C({ device : d });
      expect(qs("iframe").getAttribute("src")).toEqual(adCfg.ads[d.type]);
      dojo.empty(t);
    });
  });
});
