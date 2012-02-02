describe("child node grid component", function() {
  var pg, t, C, config, nodes, c, node;

  beforeEach(function() {
    dojo.require('toura.app.UI');
    dojo.require('toura.app.Config');
    dojo.require('toura.app.PhoneGap');
    dojo.require('toura.components.ChildNodeGrid');
    dojo.require('toura.ui.BackgroundImage');

    nodes = [];

    if (!pg) {
      dojo.publish('/app/start');
      pg = true;
    }

    toura.app.UI = {
      supportsCssBackgroundContain : function() { return true; },
      viewport : {
        width : 100,
        height : 100
      }
    };

    if (c) { c.destroy(); }
    C = toura.components.ChildNodeGrid;
    t = dojo.byId('test');

    node = {
      children : [ ],
      populateChildren : function() {}
    };
  });

  it("should create a child node grid component", function() {
    var c = new C({ node : node }).placeAt(t);
    expect(t.querySelector(getRootSelector(c))).toBeTruthy();
  });

  it("should not set the grid size on phone because there's only one size", function() {
    var c = new C({ node : node, device : { type : 'phone', os : 'fake' } }).placeAt(t);

    var elmt = t.querySelector(getRootSelector(c));
    expect(/small|medium|large/.test(elmt.className)).toBeFalsy();
  });

  it("should set the grid size to large on tablet for less than 12 items", function() {
    node.children = makeMockNodes(11, { featuredImage : { small : {}, large : {} } });
    var c = new C({
      node : node,
      device : { type : 'tablet', os : 'fake' }
    }).placeAt(t);

    expect(dojo.hasClass(c.domNode, 'size-large')).toBeTruthy();
  });

  it("should set the grid size to medium on tablet for less than 24 items", function() {
    node.children = makeMockNodes(23, { featuredImage : { small : {}, large : {} } });
    var c = new C({
      node : node,
      device : { type : 'tablet', os : 'fake' }
    }).placeAt(t);

    expect(dojo.hasClass(c.domNode, 'size-medium')).toBeTruthy();
  });

  describe("device-specific css", function() {
    beforeEach(function() {
      dojo.destroy(dojo.byId('component-css-child-node-grid'));
      toura.components.ChildNodeGrid.placedCSS = false;
    });

    it("should add the android-specific css to the page", function() {
      toura.app.UI = {
        viewport : {
          width : 100,
          height : 100
        }
      };

      var c = new C({
        node : node,
        device : { type : 'phone', os : 'android' }
      });

      expect(dojo.byId('component-css-child-node-grid')).toBeTruthy();
      expect(toura.components.ChildNodeGrid.placedCSS).toBeTruthy();
    });

    it("should not insert child node grid component css for ios", function() {
      var c = new C({
        node : node,
        device : { type : 'phone', os : 'ios' }
      });

      expect(dojo.byId('component-css-child-node-grid')).toBeFalsy();
      expect(toura.components.ChildNodeGrid.placedCSS).toBeFalsy();
    });
  });
});
