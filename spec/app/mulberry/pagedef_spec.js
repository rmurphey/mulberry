describe("mulberry._PageDef", function() {
  var pagedef;

  beforeEach(function() {
    dojo.require('mulberry._PageDef');
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

  it("should create mulberry.pageDefs", function() {
    expect(mulberry.pageDefs).toBeDefined();
  });

  it("should expose a method for adding entries to mulberry.pageDefs", function() {
    mulberry.pageDef('foo', pagedef);
    expect(mulberry.pageDefs.foo).toBeDefined();
    expect(mulberry.pageDefs.foo.screens[0].regions[0].components[0]).toBe('Foo');
    expect(mulberry.pageDefs.foo instanceof mulberry._PageDef).toBeTruthy();
  });

  it("should throw an error if the pagedef does not include screens", function() {
    expect(function() {
      mulberry.pageDef('another', 'bar');
    }).toThrow();
  });

  it("should throw an error if the pagedef screens do not include regions", function() {
    expect(function() {
      mulberry.pageDef('another', { screens : [ 'bar' ] });
    }).toThrow();
  });

});
