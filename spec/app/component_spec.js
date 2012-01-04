describe("base _Component class", function() {
  var c, C, t, img, node;

  beforeEach(function() {
    dojo.require('toura._Component');

    t = dojo.byId('test');

    C = function(config) {
      return new toura._Component(config || {
        templateString : ".fake-component loremipsum"
      }).placeAt(t);
    };

    if (c) { c.destroy(); }

    node = nodeForController('Default');
  });

  it("should properly create a base component", function() {
    c = C();

    expect(t.querySelector('.fake-component')).toBeTruthy();
    expect(t.innerHTML).toMatch('loremipsum');
  });

  it("should run custom lifecycle methods", function() {
    var prepareData,
        postMixInProperties,

        setupChildComponents,
        adjustMarkup,
        setupConnections,
        setupSubscriptions,
        postCreate,

        startup,
        resizeElements,

        teardown,
        destroy,

        i = 0;

    dojo.declare('my.Thinger', toura._Component, {
      templateString : '.foo',

      postMixInProperties : function() {
        this.inherited(arguments);
        postMixInProperties = i++;
      },

      prepareData : function() {
        prepareData = i++;
      },

      postCreate : function() {
        this.inherited(arguments);
        postCreate = i++;
      },

      setupChildComponents : function() {
        setupChildComponents = i++;
      },

      adjustMarkup : function() {
        adjustMarkup = i++;
      },

      setupConnections : function() {
        setupConnections = i++;
      },

      setupSubscriptions : function() {
        setupSubscriptions = i++;
      },

      startup : function() {
        this.inherited(arguments);
        startup = i++;
      },

      resizeElements : function() {
        resizeElements = i++;
      },

      destroy : function() {
        this.inherited(arguments);
        destroy = i++;
      },

      teardown : function() {
        teardown = i++;
      }
    });

    var instance = new my.Thinger().placeAt(t);
    instance.startup();
    instance.destroy();

    expect(prepareData).toBe(0);
    expect(postMixInProperties).toBe(1);
    expect(setupChildComponents).toBe(2);
    expect(adjustMarkup).toBe(3);
    expect(setupConnections).toBe(4);
    expect(setupSubscriptions).toBe(5);
    expect(postCreate).toBe(6);
    expect(resizeElements).toBe(7);
    expect(startup).toBe(8);
    expect(teardown).toBe(9);
    expect(destroy).toBe(10);
  });

  it("should add a class to the root dom node if a class property is defined", function() {
    c = C({ 'class' : 'some-old-class' });

    expect(t.querySelector('.some-old-class')).toBeTruthy();
  });

  it("should set a new class on the root dom node when the class property is set", function() {
    c = C({ 'class' : 'some-old-class' });

    c.set('class', 'some-new-class');
    expect(t.querySelector('.some-new-class')).toBeTruthy();
    expect(t.querySelector('.some-old-class')).toBeFalsy();
  });

  it("should set up a component", function() {
    expect(function() {
      C({ device : 'phone', node : node });
    }).not.toThrow();
  });

  it("should return its current dimensions", function() {
    dojo.style(t, 'width', '300px');
    dojo.style(t, 'height', '200px');
    c = C({ device : 'phone', node : node });
    c.startup();

    // Assume that the component will fill the width of it's container, but
    // it's height won't be affected because it has no content
    expect(c.getDimensions().width).toEqual(300);
    expect(c.getDimensions().height < 200).toBeTruthy();

    dojo.style(t, 'width', '500px');
    dojo.publish('/window/resize');
    expect(c.getDimensions().width).toEqual(500);
  });

  it("should load helper templates if present", function() {
    c = C({
      device : 'phone',
      node : node,
      helpers : {
        fakeHelper : '.fakeHelper'
      }
    });

    expect(c.helpers.fakeHelper).toBeDefined();
    t.innerHTML = c.helpers.fakeHelper;
    expect(t.querySelector('.fakeHelper')).toBeTruthy();
  });

  it("should be able to repopulate itself", function() {
    c = C({
      device : 'phone',
      node : node,
      templateString : '.foo\n  .bar{ dojoAttachPoint : "bar" }'
    });

    c.populate(function(item) { return item.text; }, [
      { text : 'text1' },
      { text : 'text2' }
    ]);

    expect(c.domNode.innerHTML).toMatch('text1');
    expect(c.domNode.innerHTML).toMatch('text2');
    expect(c.domNode.querySelector('.bar')).toBeFalsy();
  });

  it("should be able to repopulate itself from a single data point", function() {
    c = C({
      device : 'phone',
      node : node,
      templateString : '.foo\n  .bar{ dojoAttachPoint : "bar" }'
    });

    c.populate(function(item) { return item.text; }, { text : 'text1' });

    expect(c.domNode.innerHTML).toMatch('text1');
    expect(c.domNode.querySelector('.bar')).toBeFalsy();
  });

  it("should be able to repopulate named nodes", function() {
    c = C({
      device : 'phone',
      node : node,
      templateString : '.foo\n  .bar{ dojoAttachPoint : "bar" }'
    });

    c.populateElement('bar', function(item) { return item.text; }, [
      { text : 'text1' },
      { text : 'text2' }
    ]);

    expect(c.bar.innerHTML).toMatch('text1');
    expect(c.bar.innerHTML).toMatch('text2');
  });

  it("should be able to repopulate named nodes from a single element", function() {
    c = C({
      device : 'phone',
      node : node,
      templateString : '.foo\n  .bar{ dojoAttachPoint : "bar" }'
    });

    c.populateElement('bar', function(item) { return item.text; }, { text : 'text1' });

    expect(c.bar.innerHTML).toMatch('text1');
  });

  it("should be able to repopulate nodes", function() {
    c = C({
      device : 'phone',
      node : node,
      templateString : '.foo\n  .bar{ dojoAttachPoint : "bar" }'
    });

    c.populateElement(c.bar, function(item) { return item.text; }, [
      { text : 'text1' },
      { text : 'text2' }
    ]);

    expect(c.bar.innerHTML).toMatch('text1');
    expect(c.bar.innerHTML).toMatch('text2');
  });

  it("should be able to repopulate nodes from a single data point", function() {
    c = C({
      device : 'phone',
      node : node,
      templateString : '.foo\n  .bar{ dojoAttachPoint : "bar" }'
    });

    c.populateElement(c.bar, function(item) { return item.text; }, { text : 'text1' });

    expect(c.bar.innerHTML).toMatch('text1');
  });

  it("should automatically resolve promises as specified by the when object", function() {
    var dfd = new dojo.Deferred(),
        flag;

    c = C({
      node : {
        promise : dfd.promise
      },
      when : {
        'promise' : function(result) {
          flag = result;
        }
      }
    });

    c.startup();
    dfd.resolve('resolved');
    expect(flag).toBe('resolved');
  });

  it("should accept a string as the resolver", function() {
    var dfd = new dojo.Deferred(),
        flag;

    c = C({
      node : {
        promise : dfd.promise
      },
      when : {
        'promise' : 'foo'
      },
      foo : function(result) {
        flag = result;
      }
    });

    c.startup();
    dfd.resolve('resolved');
    expect(flag).toBe('resolved');
  });

  it("should call the resolver in the scope of the component", function() {
    var dfd = new dojo.Deferred(),
        flag;

    c = C({
      node : {
        promise : dfd.promise
      },
      when : {
        'promise' : function(result) {
          this.foo(result);
        }
      },
      foo : function(result) {
        flag = result;
      }
    });

    c.startup();
    dfd.resolve('resolved');
    expect(flag).toBe('resolved');
  });
});
