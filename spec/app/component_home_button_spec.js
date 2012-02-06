describe("home button", function() {
  var t, C, c;

  beforeEach(function() {
    dojo.require('toura.components.buttons.HomeButton');
    dojo.require('toura.URL');

    t = dojo.byId('test');
    if (c) { c.destroy(); }
    C = toura.components.buttons.HomeButton;
    routerMock();
  });

  it("should set up the button", function() {
    c = C().placeAt(t);
    expect(t.querySelector(getRootSelector(c))).toBeTruthy();
    expect(c.preventWhenAnimating).toBeTruthy();
  });

  it("should tell the router to go home when clicked", function() {
    var flag = false;
    c = C().placeAt(t);
    var spy = spyOn(mulberry.app.Router, 'home');

    c.onClick(fakeEventObj);
    expect(spy).toHaveBeenCalled();
  });
});
