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

    mulberry.app.Config.set("app", adCfg);

    if (c) { c.destroy(); }
    C = function(config) {
      var c = new toura.components.AdTag(config || {}).placeAt(t);
      c.startup();
      return c;
    };
  });

  it("should place the component on the page", function() {
    c = C();
    expect(qs(getRootSelector(c))).toBeTruthy();
    expect(c.adFrame).toBeDefined();
  });

  it("should add a class to the body indicating the presence of ads", function() {
    c = C();
    expect(dojo.hasClass(dojo.body(), 'has-ads')).toBeTruthy();
  });

  it("should set the src of the iframe from the app's config object", function() {
    allDevices(function(d) {
      c = C({ device : d });
      expect(qs("iframe").getAttribute("src")).toMatch(adCfg.ads[d.type]);
      dojo.empty(t);
    });
  });

  it("should remove itself from the DOM if there is no ad url for the device type", function() {
    allDevices(function(d) {
      adCfg = d.type === 'phone' ?
        { ads : { tablet : 'foo' } } :
        { ads : { phone : 'foo' } };

      mulberry.app.Config.set("app", adCfg);

      c = C({ device : d });
      expect(document.querySelector('.component.ad-tag')).toBeFalsy();
      dojo.empty(t);
    });
  });
});
