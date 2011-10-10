describe("delete button", function() {
  var t, C, c;

  beforeEach(function() {
    dojo.require('toura.components.buttons.DeleteButton');
    t = dojo.byId('test');
    C = toura.components.buttons.DeleteButton;
    if (c) { c.destroy(); }
    toura.app.UI.hasTouch = false;
  });

  it("should set up the button", function() {
    c = C().placeAt(t);
    expect(t.querySelector(getRootSelector(c))).toBeTruthy();
    expect(t.innerHTML).toMatch(c.i18n_text);
    expect(c.deleting).toBeFalsy();
    expect(c.objId).toBeDefined();
  });

  it("should enter a delete confirmation state on the first click", function() {
    c = C().placeAt(t);
    spyOn(c, 'onDelete');

    expect(c.deleting).toBeFalsy();
    expect(dojo.hasClass(c.domNode, 'deleting')).toBeFalsy();

    c.onClick(fakeEventObj);
    expect(c.deleting).toBeTruthy();
    expect(dojo.hasClass(c.domNode, 'deleting')).toBeTruthy();
    expect(c.onDelete).not.toHaveBeenCalled();
  });

  it("should call its onDelete method when deletion is confirmed", function() {
    c = C({ objId : 'foo' }).placeAt(t);
    c.deleting = true;
    spyOn(c, 'onDelete');

    c.onClick(fakeEventObj);
    expect(c.onDelete).toHaveBeenCalledWith('foo', c.domNode);
  });
});
