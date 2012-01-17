describe("page factory", function() {
  var f;

  beforeEach(function() {
    dojo.require("toura.app.PageFactory");
    f = f || new toura.app.PageFactory({ type : 'fake', os : 'fake' });

    toura.pageDefs = {
      "user defined template" : "success",
      "default" : "default"
    };
  });

  it("should use a user defined template if one is defined", function() {
    var node = {
      pageDef : 'user defined template'
    };

    var spy = spyOn(toura.containers, 'Page');

    f.createPage(node);

    expect(spy).toHaveBeenCalled();
    expect(spy.mostRecentCall.args[0].baseObj).toBe(node);
    expect(spy.mostRecentCall.args[0].device).toBe(f.device);
    expect(spy.mostRecentCall.args[0].pageDef).toBe('success');
  });

  it("should throw an error if no page object is provided", function() {
    expect(function() { f.createPage(); }).toThrow();
  });

  it("should throw an error if the controller associated with the node does not exist", function() {
    expect(function() {
      f.createPage('node', { pageDef : 'nonexistent' });
    }).toThrow();
  });
});
