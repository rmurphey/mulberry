describe("body text component", function() {
  var t, C, c, node = {
    bodyText : { body : 'test text' }
  };

  beforeEach(function() {
    dojo.require('toura.components.BodyText');

    t = dojo.byId('test');

    if (c) { c.destroy(); }

    C = toura.components.BodyText;
  });

  it("should display the node body text", function() {
    c = C({ node : node }).placeAt(t);
    expect(t.innerHTML.match(node.bodyText.body)).toBeTruthy();
    expect(t.querySelector(getRootSelector(c))).toBeTruthy();
  });

  it("should display no text if no node is provided", function() {
    expect(function() {
      c = C({ }).placeAt(t);
    }).not.toThrow();

    expect(dojo.trim(c.bodyTextContainer.innerHTML)).toBe('');
  });

  it("should allow the body text to be changed", function() {
    var txt = 'text test';

    c = C({ node : node });

    c.set('content', txt);
    expect(c.domNode.innerHTML).not.toMatch(node.bodyText.body);
    expect(c.domNode.innerHTML).toMatch(txt);
  });

  it("should point rel='external' links at the external browser", function() {
    node.bodyText.body = '<a href="#" rel="external">foo</a>';
    c = C({ node : node });
    expect(c.domNode.querySelector('a[target="_blank"]')).toBeTruthy();
  });

  it("should add the 'empty' class when its content is set to an empty string", function() {
    c = C({ node : node });
    c.set('content', '');
    expect(dojo.hasClass(c.domNode, 'empty')).toBeTruthy();
  });

  it("should remove the 'empty' class when its content is non-empty", function() {
    c = C({ node : node });
    c.set('content', 'not empty');
    expect(dojo.hasClass(c.domNode, 'empty')).toBeFalsy();
  });
});
