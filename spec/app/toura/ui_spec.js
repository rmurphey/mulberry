describe("toura ui", function() {
  var ui, createUI;

  beforeEach(function() {
    mulberry.app.PhoneGap = {
      present : true,
      network : {
        isReachable : function() {
          var dfd = new dojo.Deferred();
          dfd.resolve(true);
          return dfd.promise;
        }
      }
    };

    mulberry.app.UI = {
      showPage : function() { },
      set : function() { },
      addPersistentComponent : function(C) {
        return new C();
      }
    };

    dojo.require('toura.UI');

    createUI = function() {
      var ui = new toura.UI();
      dojo.publish('/ui/ready');
      return ui;
    }
  });

  it("should add classes for feature flags to the body", function() {
    var b = dojo.body();

    toura.features = {
      foo : true,
      baz : false
    };

    ui = createUI();

    expect(dojo.hasClass(b, 'feature-foo')).toBeTruthy();
    expect(dojo.hasClass(b, 'feature-bar')).toBeFalsy();
  });

  describe("sibling nav", function() {
    it("should create the sibling nav if it is enabled", function() {
      console.log('should create');
      toura.features.siblingNav = true;
      var spy = spyOn(mulberry.app.UI, 'addPersistentComponent').andCallThrough();
      ui = createUI();
      expect(ui.siblingNav).toBeDefined();
      expect(spy).toHaveBeenCalledWith(toura.components.SiblingNav);
    });

    it("should not create the sibling nav if it is not enabled", function() {
      toura.features.siblingNav = false;
      var spy = spyOn(mulberry.app.UI, 'addPersistentComponent').andCallThrough();

      ui = createUI();

      expect(ui.siblingNav).not.toBeDefined();
      expect(spy).not.toHaveBeenCalled();
    });

    it("should pass the node for the current page to the sibling nav", function() {
      toura.features.siblingNav = true;
      ui = createUI();

      var spy = spyOn(ui.siblingNav, 'set');
      mulberry.app.UI.showPage('foo', 'bar');
      expect(spy).toHaveBeenCalledWith('node', 'bar');
    });

    it("should allow setting the visibility of the sibling nav", function() {
      toura.features.siblingNav = true;
      ui = createUI();
      ui.set('siblingNavVisible', false);
      expect(ui.siblingNav.domNode.className).toMatch('hidden');
    });

    it("should not show the sibling nav if there are no siblings", function() {
      toura.features.siblingNav = true;
      ui = createUI();

      ui.set('siblingNavVisible', false);
      ui.siblingNav.siblings = false;
      ui.set('siblingNavVisible', true);
      expect(ui.siblingNav.domNode.className).toMatch('hidden');
    });
  });

  describe("ad tag", function() {
    it("should create the ad container if it is enabled", function() {
      toura.features.ads = true;
      var spy = spyOn(mulberry.app.UI, 'addPersistentComponent');

      ui = createUI();
      expect(spy).toHaveBeenCalledWith(toura.components.AdTag);
    });

    it("should not create the ad container if it is not enabled", function() {
      toura.features = {};
      var spy = spyOn(mulberry.app.UI, 'addPersistentComponent');

      ui = createUI();
      expect(spy).not.toHaveBeenCalled();
    });
  });

});
