describe("toura._PageDef", function() {
  var pagedef;

  beforeEach(function() {
    dojo.require('toura._PageDef');
    pagedef = {
      screens : [
        {
          regions : [
            { components : [ 'Foo' ] }
          ]
        }
      ]
    };
  });

  it("should create toura.pagedefs", function() {
    expect(toura.pagedefs).toBeDefined();
  });

  it("should expose a method for adding entries to toura.pagedefs", function() {
    toura.pageDef('foo', pagedef);
    expect(toura.pagedefs.foo).toBeDefined();
    expect(toura.pagedefs.foo).toBe(pagedef);
  });

  it("should throw an error if the pagedef does not include screens", function() {
    expect(function() {
      toura.pageDef('another', 'bar');
    }).toThrow();
  });

  it("should throw an error if the pagedef screens do not include regions", function() {
    expect(function() {
      toura.pageDef('another', { screens : [] });
    }).toThrow();
  });

});
