describe("user interface controller", function() {
  var ui, pg, ds;

  beforeEach(function() {
    dojo.require("toura.app.UI");
    dojo.require("toura.app.PhoneGap");
    dojo.require("toura.app.DeviceStorage");

    if (!pg) {
      dojo.publish('/app/start');
      pg = true;
    }

    if (!ds) {
      toura.app.DeviceStorage.init('fakeid');
      ds = true;
    }

    ui = ui || new toura.app.UI({ os : 'fake', type : 'fake' });
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
    var spy = spyOn(toura.app.DeviceStorage, 'set');

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
      ui = new toura.app.UI(devices[0]);
      expect(ui.siblingNav).toBeDefined();
    });

    it("should not create the sibling nav if it is not enabled", function() {
      toura.features.siblingNav = false;
      ui = new toura.app.UI(devices[0]);
      expect(ui.siblingNav).not.toBeDefined();
    });

    it("should pass the node for the current page to the sibling nav", function() {
      toura.features.siblingNav = true;
      ui = new toura.app.UI(devices[0]);

      spyOn(ui.containers.viewport, 'set');
      var spy = spyOn(ui.siblingNav, 'set');

      ui.showPage('foo', 'bar');

      expect(spy).toHaveBeenCalledWith('node', 'bar');
    });

    it("should allow setting the visibility of the sibling nav", function() {
      toura.features.siblingNav = true;
      ui = new toura.app.UI(devices[0]);
      ui.set('siblingNavVisible', false);
      expect(ui.siblingNav.domNode.className).toMatch('hidden');
    });

    it("should not show the sibling nav if there are no siblings", function() {
      toura.features.siblingNav = true;
      ui = new toura.app.UI(devices[0]);
      ui.set('siblingNavVisible', false);
      ui.siblingNav.siblings = false;
      ui.set('siblingNavVisible', true);
      expect(ui.siblingNav.domNode.className).toMatch('hidden');
    });
  });

  describe("feature flags", function() {
    it("should add a class to the body for enabled feature flags", function() {
      toura.features.foo = true;
      toura.features.bar = false;

      ui = new toura.app.UI(devices[0]);
      expect(dojo.hasClass(dojo.body(), 'feature-foo')).toBeTruthy();
      expect(dojo.hasClass(dojo.body(), 'feature-bar')).toBeFalsy();
    });
  });

});
