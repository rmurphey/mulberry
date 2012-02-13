describe("user interface controller", function() {
  var ui, pg, ds;

  beforeEach(function() {
    dojo.require("mulberry.app.UI");
    dojo.require("mulberry.app.PhoneGap");
    dojo.require("mulberry.app.DeviceStorage");

    if (!pg) {
      dojo.publish('/app/deviceready');
      dojo.publish('/app/start');
      pg = true;
    }

    if (!ds) {
      mulberry.app.DeviceStorage.init('fakeid');
      ds = true;
    }

    ui = ui || new mulberry.app.UI({ os : 'fake', type : 'fake' });
  });

  it("should set up the main container", function() {
    expect(dojo.query(".viewport").length).toBe(1);
  });

  describe("page population", function() {
    it("should pass page content to the page container", function() {
      spyOn(ui.containers.viewport, "_setContentAttr");
      ui.showPage("fake page");
      expect(ui.containers.viewport._setContentAttr).toHaveBeenCalledWith("fake page");
    });

    it("should throw an error when attempting to show a page without providing a page type", function() {
      expect(function() { ui.showPage(); }).toThrow();
    });
  });

  it("should destroy the splash div when asked", function() {
    dojo.place(dojo.create('div', { id : 'splash' }), dojo.body());

    ui.hideSplash();
    expect(dojo.byId('splash')).toBeFalsy();
  });

  it("should allow setting the nav direction", function() {
    expect(ui.containers.viewport.direction).toBe('next');
    ui.set('navDirection', 'back');
    expect(ui.containers.viewport.direction).toBe('prev');
  });

  it("should allow setting the font size", function() {
    var spy = spyOn(mulberry.app.DeviceStorage, 'set');

    ui.set('fontSize', 'foo');
    expect(dojo.body().className).toMatch('foo');
    ui.set('fontSize', 'bar');
    expect(dojo.body().className).not.toMatch('foo');
    expect(dojo.body().className).toMatch('bar');

    expect(spy.callCount).toBe(2);
  });

  describe("sibling nav", function() {
    it("should create the sibling nav if it is enabled", function() {
      toura.features.siblingNav = true;
      ui = new mulberry.app.UI(devices[0]);
      expect(ui.siblingNav).toBeDefined();
    });

    it("should not create the sibling nav if it is not enabled", function() {
      toura.features.siblingNav = false;
      ui = new mulberry.app.UI(devices[0]);
      expect(ui.siblingNav).not.toBeDefined();
    });

    it("should pass the node for the current page to the sibling nav", function() {
      toura.features.siblingNav = true;
      ui = new mulberry.app.UI(devices[0]);

      spyOn(ui.containers.viewport, 'set');
      var spy = spyOn(ui.siblingNav, 'set');

      ui.showPage('foo', 'bar');

      expect(spy).toHaveBeenCalledWith('node', 'bar');
    });

    it("should allow setting the visibility of the sibling nav", function() {
      toura.features.siblingNav = true;
      ui = new mulberry.app.UI(devices[0]);
      ui.set('siblingNavVisible', false);
      expect(ui.siblingNav.domNode.className).toMatch('hidden');
    });

    it("should not show the sibling nav if there are no siblings", function() {
      toura.features.siblingNav = true;
      ui = new mulberry.app.UI(devices[0]);
      ui.set('siblingNavVisible', false);
      ui.siblingNav.siblings = false;
      ui.set('siblingNavVisible', true);
      expect(ui.siblingNav.domNode.className).toMatch('hidden');
    });
  });

  describe("ad tag", function() {
    it("should create the ad container if it is enabled", function() {
      mulberry.features.ads = true;
      ui = new mulberry.app.UI(devices[0]);
      expect(document.querySelector('.component.ad-tag')).toBeDefined();
    });

    it("should not create the ad container if it is not enabled", function() {
      mulberry.features.ads = false;
      ui = new mulberry.app.UI(devices[0]);
      expect(document.querySelector('.component.ad-tag')).toBeFalsy();
    });
  });
});
