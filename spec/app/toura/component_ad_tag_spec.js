describe("ad tag component", function() {
  var t, C, c, node, adCfg;

  beforeEach(function() {
    dojo.require('toura.components.AdTag');
    t = dojo.byId('test');
    qs = dojo.hitch(t, 'querySelector');
    adCfg = { adConfig : 'foo' };

    mulberry.app.Config.set("app", adCfg);

    if (c) { c.destroy(); }
    C = function(config) {
      var c = new toura.components.AdTag(config || adCfg).placeAt(t);
      c.startup();
      return c;
    };
  });

  it("should place the component on the page", function() {
    c = C();
    expect(qs(getRootSelector(c))).toBeTruthy();
    expect(c.adFrame).toBeDefined();
  });

  it("should set the src of the iframe using the provided config", function() {
    c = C();
    expect(qs("iframe").getAttribute("src")).toMatch(adCfg.adConfig);
    dojo.empty(t);
  });

  it("should remove itself from the DOM if there is no adConfig provided", function() {
    c = C({});
    expect(document.querySelector('.component.ad-tag')).toBeFalsy();
    dojo.empty(t);
  });
});
