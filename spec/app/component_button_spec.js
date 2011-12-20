describe('toura.components._Button API', function() {
  var t, C, c;

  beforeEach(function() {
    dojo.require('toura.components.buttons._Button');
    t = dojo.byId('test');

    if (c) { c.destroy(); }
    C = toura.components.buttons._Button;
    routerMock();
  });

  it("should call the onClick method when clicked or touched", function() {
    dojo.forEach([ true, false ], function(hasTouch) {
      toura.app.UI.hasTouch = hasTouch;

      c = C().placeAt(t);

      var h = getEventHandler(c, hasTouch ? 'touchstart' : 'click');

      spyOn(c, 'onClick');
      h(fakeEventObj);
      expect(c.onClick).toHaveBeenCalled();
    });
  });

  it("should announce the button's URL to the router", function() {
    var flag;

    c = C({ url : 'url' }).placeAt(t);

    var spy = spyOn(toura.app.Router, 'go');

    c.onClick(fakeEventObj);
    expect(spy).toHaveBeenCalledWith('url');
  });

  it("should not announce anything to the router if the button does not have a URL", function() {
    var flag;

    c = C().placeAt(t);

    dojo.subscribe('/router/go', function() { flag = true; });

    c.onClick(fakeEventObj);
    expect(flag).toBeFalsy();
  });

  it("should not prevent the click handler from firing during animation by default", function() {
    toura.app.UI.hasTouch = false;
    c = C().placeAt(t);

    var h = getEventHandler(c, 'click');

    spyOn(c, 'onClick');

    toura.animating = true;
    h(fakeEventObj);
    expect(c.onClick).toHaveBeenCalled();
  });

  it("should prevent the click handler from firing during animation if preventWhenAnimating is set", function() {
    toura.app.UI.hasTouch = false;
    c = C({ preventWhenAnimating : true }).placeAt(t);

    var h = getEventHandler(c, 'click');
    var flag = false;

    spyOn(c, 'onClick');
    h(fakeEventObj);
    expect(c.onClick).not.toHaveBeenCalled();
  });
});
