describe("debug tools", function() {
  var t, c, C;

  beforeEach(function() {
    dojo.require('mulberry.app._Debug');
    mulberry.features.debugToolbar = true;
    t = dojo.byId('test');
    dojo.empty(t);
  });

  it("should place the debug components at the specified element", function() {
    mulberry.app._Debug(t);
    expect(t.querySelector('.component.debug-tools')).toBeTruthy();
    expect(t.querySelector('.component.debug-message')).toBeTruthy();
  });

  it("should show the weinre information", function() {
    mulberry.app._Debug(t);
    var tools = dijit.byNode(t.querySelector('.component.debug-tools')),
        message = dijit.byNode(t.querySelector('.component.debug-message'));
    tools._weinre();
    expect(message.domNode.innerHTML).toMatch('m-');
    expect(message.domNode.innerHTML).toMatch(window.WeinreServerURL);
  });
});
