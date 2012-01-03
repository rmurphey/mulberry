describe("sibling nav component", function() {
  var t, C, c, node;

  beforeEach(function() {
    dojo.require('toura.components.SiblingNav');
    t = dojo.byId('test');
    qsa = dojo.hitch(t, 'querySelectorAll');
    qs = dojo.hitch(t, 'querySelector');

    if (c) { c.destroy(); }
    C = function(config) {
      return new toura.components.SiblingNav(config || {}).placeAt(t);
    };

    node = {
      id : 'node-123',
      name : 'current node',
      siblings : [
        {
          id : 'node-122',
          name : 'prev node',
          url : toura.app.URL.node('node-122')
        },
        {
          id : 'node-123',
          name : 'current node',
          url : toura.app.URL.node('node-123')
        },
        {
          id : 'node-124',
          name : 'next node',
          url : toura.app.URL.node('node-124')
        }
      ]
    };

    routerMock();
  });

  it("should place the component on the page", function() {
    c = C();
    expect(qs(getRootSelector(c))).toBeTruthy();
    expect(c.handleNode).toBeDefined();
    expect(c.prevButton).toBeDefined();
    expect(c.nextButton).toBeDefined();
    expect(c.siblingList).toBeDefined();
  });

  describe("user interaction with links", function() {
    it("should listen for touchstart on the sibling list in touch environments", function() {
      toura.app.UI.hasTouch = true;
      c = C();

      var h = getEventHandler(c, 'touchstart', c.siblingList);
      expect(h).toBeTruthy();
    });

    it("should listen for click on the sibling list in non-touch environments", function() {
      toura.app.UI.hasTouch = false;
      c = C();

      var h = getEventHandler(c, 'click', c.siblingList);
      expect(h).toBeTruthy();
    });

    it("should announce a click on a sibling link to the router", function() {
      toura.app.UI.hasTouch = false;
      c = C();

      var h = getEventHandler(c, 'click', c.siblingList);
      var spy = spyOn(toura.app.Router, 'go');
      var tpl = c.siblingTemplate;
      var tmp = dojo.create('div');

      tmp.innerHTML = tpl({
        url : 'fake',
        className : 'fake',
        name : 'fake name'
      });


      h({ target : tmp.firstChild.firstChild });
      expect(spy).toHaveBeenCalledWith('fake', true);
    });
  });

  describe("user interaction with buttons", function() {
    it("should listen for touchstart on buttons in touch environments", function() {
      toura.app.UI.hasTouch = true;
      c = C();

      var prevHandler = getEventHandler(c, 'touchstart', c.prevButton);
      var nextHandler = getEventHandler(c, 'touchstart', c.nextButton);

      expect(prevHandler).toBeTruthy();
      expect(nextHandler).toBeTruthy();
    });

    it("should listen for click on buttons in non-touch environments", function() {
      toura.app.UI.hasTouch = false;
      c = C();

      var prevHandler = getEventHandler(c, 'click', c.prevButton);
      var nextHandler = getEventHandler(c, 'click', c.nextButton);

      expect(prevHandler).toBeTruthy();
      expect(nextHandler).toBeTruthy();
    });

    it("should announce a click on the previous button to the router with the proper url", function() {
      toura.app.UI.hasTouch = false;
      c = C();
      c.set('node', node);

      var spy = spyOn(toura.app.Router, 'go');
      var prevHandler = getEventHandler(c, 'click', c.prevButton);


      prevHandler();
      expect(spy).toHaveBeenCalledWith(node.siblings[0].url, true);
    });

    it("should announce a click on the next button to the router with the proper url", function() {
      toura.app.UI.hasTouch = false;
      c = C();
      c.set('node', node);

      var spy = spyOn(toura.app.Router, 'go');
      var nextHandler = getEventHandler(c, 'click', c.nextButton);

      nextHandler();
      expect(spy).toHaveBeenCalledWith(node.siblings[2].url, true);
    });
  });

  describe("navigation", function() {

    it("should display the title of the previous sibling if there is one", function() {
      c = C();
      c.set('node', node);
      expect(t.innerHTML).toMatch(node.siblings[0].name);
    });

    it("should display an active previous button if there is a previous sibling", function() {
      c = C();
      c.set('node', node);
      expect(dojo.hasClass(c.prevButton, 'inactive')).toBeFalsy();
    });

    it("should show an inactive previous button if there is no previous sibling", function() {
      node.siblings = node.siblings.slice(1,2);
      c = C();
      c.set('node', node);
      expect(dojo.hasClass(c.prevButton, 'inactive')).toBeTruthy();
    });

    it("should show an empty previous sibling title if there is no previous sibling", function() {
      var oldSiblings = [].concat(node.siblings);

      node.siblings = node.siblings.slice(1,2);
      c = C();
      c.set('node', node);
      expect(t.innerHTML).not.toMatch(oldSiblings[0].name);
    });

    it("should display the title of the next sibling if there is a next sibling", function() {
      c = C();
      c.set('node', node);
      expect(t.innerHTML).toMatch(node.siblings[2].name);
    });

    it("should display an active next button if there is a next sibling", function() {
      c = C();
      c.set('node', node);
      expect(dojo.hasClass(c.nextButton, 'inactive')).toBeFalsy();
    });

    it("should show an inactive next button if there is no next sibling", function() {
      node.siblings = node.siblings.slice(0,1);
      c = C();
      c.set('node', node);
      expect(dojo.hasClass(c.nextButton, 'inactive')).toBeTruthy();
    });

    it("should show an empty next sibling title if there is no next sibling", function() {
      var oldSiblings = [].concat(node.siblings);

      node.siblings = node.siblings.slice(0,1);
      c = C();
      c.set('node', node);
      expect(t.innerHTML).not.toMatch(oldSiblings[2].name);
    });

    it("should announce backwards navigation when the user clicks on the previous button", function() {
      toura.app.UI.hasTouch = false;
      c = C();
      c.set('node', node);
      var h = getEventHandler(c, 'click', c.prevButton);
      var spy = spyOn(toura.app.UI, 'set');
      h();
      expect(spy).toHaveBeenCalledWith('navDirection', 'back');
    });
  });

  it("should be entirely hidden if the provided node has no siblings", function() {
    node.siblings = [];
    c = C();
    c.set('node', node);
    expect(dojo.hasClass(c.domNode, 'hidden')).toBeTruthy();
  });

  it("should be entirely hidden if no node is provided", function() {
    c = C();
    c.set('node', null);
    expect(dojo.hasClass(c.domNode, 'hidden')).toBeTruthy();
  });

  it("should be visible if a node with siblings is provided", function() {
    c = C();
    c.set('node', node);
    expect(dojo.hasClass(c.domNode, 'hidden')).toBeFalsy();
  });

  describe("open/close toggle", function() {
    it("should begin in a closed state", function() {
      c = C();
      expect(dojo.hasClass(c.domNode, 'open')).toBeFalsy();
    });

    it("should expose a setter that allows changing its state", function() {
      c = C();

      c.set('open', true);
      expect(dojo.hasClass(c.domNode, 'open')).toBeTruthy();

      c.set('open', false);
      expect(dojo.hasClass(c.domNode, 'open')).toBeFalsy();
    });

    it("should expose a method that allows toggling its state", function() {
      c = C();

      c.toggle();
      expect(dojo.hasClass(c.domNode, 'open')).toBeTruthy();
      c.toggle();
      expect(dojo.hasClass(c.domNode, 'open')).toBeFalsy();
    });

    describe("event handling", function() {
      it("should listen for user touch interaction with the handle in touch environment", function() {
        toura.app.UI.hasTouch = true;
        c = C();
        var spy = spyOn(c, 'toggle');
        var h = getEventHandler(c, 'touchstart', c.handleNode);
        h(fakeEventObj);
        expect(spy).toHaveBeenCalled();
      });

      it("should listen for a click on the handle in a non-touch environment", function() {
        toura.app.UI.hasTouch = false;
        c = C();
        var spy = spyOn(c, 'toggle');
        var h = getEventHandler(c, 'click', c.handleNode);
        h(fakeEventObj);
        expect(spy).toHaveBeenCalled();
      });
    });
  });

});
