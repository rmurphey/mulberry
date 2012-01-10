describe("router", function() {
  var test, api, init,
      routes = [
        {
          route : '/home',
          handler : function() { test = '/home'; }
        },
        {
          route : '/test',
          handler : function() {
            console.log('TEST ROUTE');
            test = '/test';
          },
          isDefault : true
        },
        {
          route : '/test2',
          handler : function() {
            console.log('TEST 2 ROUTE');
            test = '/test2';
          }
        },
        {
          route : '/basic',
          handler : function() { test = 'basic'; }
        },
        {
          route : '/bar/:baz',
          handler : function(params) {
            test = params.baz;
          }
        },
        {
          route : '/bar/:baz/:bim',
          handler : function(params) {
            test = params.baz + params.bim;
          }
        },
        {
          route : '/bar/:baz/bim/:bop',
          handler : function(params) {
            test = params.baz + params.bop;
          }
        },
        {
          route : /\/splat\/(.*)/,
          handler : function(params) {
            test = params.splat[0];
          }
        },
        {
          route : /\/splat\/(.*)\/foo\/(.*)/,
          handler : function(params) {
            test = params.splat[0] + ':' + params.splat[1];
          }
        }
      ];

  beforeEach(function() {
    dojo.require("toura.app.Router");
    api = api || toura.app.Router;

    if (!init) {
      toura.routes(routes);
    }

    api.init();

    test = false;
    init = true;
  });

  it("should handle a hash if one is set when initialized", function() {
    api.go('#/test2');
    expect(test).toBe('/test2');
  });

  it("should expose a method for going to a new url", function() {
    api.go('#/basic');
    expect(test).toBe('basic');
  });

  it("should expose a method for going to the home node", function() {
    var spy = spyOn(toura.app.UI, 'set');
    api.home();
    expect(test).toBe('/home');
    expect(spy).toHaveBeenCalledWith('navDirection', 'back');
  });

  it("should expose a method for going back in the history", function() {
    var uiSpy = spyOn(toura.app.UI, 'set');
    var historySpy = spyOn(window.history, 'back');
    api.back();
    expect(historySpy).toHaveBeenCalled();
    expect(uiSpy).toHaveBeenCalledWith('navDirection', 'back');
  });

  it("should route the request to the appropriate route with the parameters", function() {
    var redir = function(loc) {
      api.go(loc);
    };

    redir('/bar/test-123');
    expect(test).toBe('test-123');

    redir('/basic');
    expect(test).toBe('basic');

    redir('/bar/hello/world');
    expect(test).toBe('helloworld');

    redir('/bar/testing/bim/123');
    expect(test).toBe('testing123');

    redir('/splat/1/2/3');
    expect(test).toBe('1/2/3');

    redir('/splat/1/2/3/foo/4/5/6');
    expect(test).toBe('1/2/3:4/5/6');
  });

  it("should redirect to the default route if no route is defined for the hash", function() {
    api.go('#/nonexistent');
    expect(test).toBe('/test');
  });

  it("should use the default route if the URL doesn't include a hash", function() {
    api.go('');
    expect(test).toBe('/test');
  });

  it("should always use the last-provided default route", function() {
    toura.route('/test', function() {
      test = '/newdefault';
    }, true);
    api.go('');
    expect(test).toBe('/newdefault');
  });
});
