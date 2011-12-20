describe('back button', function() {
  var t, c, C;

  beforeEach(function() {
    dojo.require('toura.components.buttons.BackButton');
    C = toura.components.buttons.BackButton;
    if (c) { c.destroy(); }
    t = dojo.byId('test');
    routerMock();
  });

  it("should create the component on the page", function() {
    c = C().placeAt(t);
    expect(t.querySelector(getRootSelector(c))).toBeTruthy();
    expect(t.innerHTML).toMatch(c.i18n_text);
    expect(c.preventWhenAnimating).toBeTruthy();
  });

  it("should navigate back through the history when onClick is called", function() {
    var spy = spyOn(toura.app.Router, 'back');
    c = C().placeAt(t);
    c.onClick(fakeEventObj);
    expect(spy).toHaveBeenCalled();
  });

  it("should not navigate back throught the history in the MAP environment", function() {
    var spy = spyOn(toura.app.Router, 'back');
    toura.features.disableBackButton = true;
    c = C().placeAt(t);
    c.onClick(fakeEventObj);
    expect(spy).not.toHaveBeenCalled();
  });

});
