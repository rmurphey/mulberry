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

  it("should create toura.pageDefs", function() {
    expect(toura.pageDefs).toBeDefined();
  });

  it("should expose a method for adding entries to toura.pageDefs", function() {
    toura.pageDef('foo', pagedef);
    expect(toura.pageDefs.foo).toBeDefined();
    expect(toura.pageDefs.foo.screens[0].regions[0].components[0]).toBe('Foo');
    expect(toura.pageDefs.foo instanceof toura._PageDef).toBeTruthy();
  });

  it("should throw an error if the pagedef does not include screens", function() {
    expect(function() {
      toura.pageDef('another', 'bar');
    }).toThrow();
  });

  it("should throw an error if the pagedef screens do not include regions", function() {
    expect(function() {
      toura.pageDef('another', { screens : [ 'bar' ] });
    }).toThrow();
  });

});
