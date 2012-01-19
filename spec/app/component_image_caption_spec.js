describe("image caption component", function() {
  var t, C, c, node = {
    images : [
      { caption : 'caption' }
    ]
  };

  beforeEach(function() {
    dojo.require('toura.components.ImageCaption');

    t = dojo.byId('test');

    if (c) { c.destroy(); }

    C = toura.components.ImageCaption;
  });

  it("should display the node body text", function() {
    c = C({ node : node }).placeAt(t);
    expect(t.innerHTML).toMatch(node.images[0].caption);
    expect(t.querySelector(getRootSelector(c))).toBeTruthy();
  });

  it("should display no text if no node is provided", function() {
    expect(function() {
      c = C({ }).placeAt(t);
    }).not.toThrow();

    expect(dojo.trim(c.bodyTextContainer.innerHTML)).toBe('');
  });

  it("should display no text if the image does not have a caption", function() {
    c = C({ node : { images : [ {} ] } });
    expect(dojo.trim(c.bodyTextContainer.innerHTML)).toBe('');
  });

  it("should allow the caption to be changed", function() {
    var txt2 = 'text test';

    c = C({ node : node }).placeAt(t);

    c.set('content', txt2);
    expect(t.innerText).not.toMatch(node.images[0].caption);
    expect(t.innerText).toMatch(txt2);
  });
  
});


