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

  describe("persistent components", function() {
    var componentAddedFlag;

    beforeEach(function() {
      componentAddedFlag = false;

      dojo.require('mulberry._Component');

      dojo.declare('my.Component', mulberry._Component, {
        templateString : '.my-persistent-component',
        postCreate : function() {
          componentAddedFlag = true;
        }
      });
      ui = new mulberry.app.UI(devices[0]);
    });

    it("should add persistent components to the page", function() {
      ui.addPersistentComponent(my.Component);
      expect(componentAddedFlag).toBeTruthy();
      expect(dojo.body().querySelector('.my-persistent-component')).toBeTruthy();
    });
  });
});
