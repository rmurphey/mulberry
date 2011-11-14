describe("page factory", function() {
  var f;

  beforeEach(function() {
    dojo.require("toura.app.PageFactory");
    console.log('PageFactory', toura.app.PageFactory);
    f = f || new toura.app.PageFactory({ type : 'fake', os : 'fake' });

    toura.templates = {
      "user defined template" : "success",
      "default" : "default",
      "Home1" : function() { }
    };
  });

  it("should use a user defined template if one is defined", function() {
    var node = {
      pageController : 'user defined template'
    };

    var spy = spyOn(toura.pageControllers, 'Configurable');

    f.createPage(node);

    expect(spy).toHaveBeenCalled();
    expect(spy.mostRecentCall.args[0].baseObj).toBe(node);
    expect(spy.mostRecentCall.args[0].device).toBe(f.device);
    expect(spy.mostRecentCall.args[0].templateConfig).toBe('success');
  });

  it("should use the default page controller if one is not defined", function() {
    var node = {
      pageController : ''
    };

    var spy = spyOn(toura.pageControllers, 'Configurable');

    f.createPage("node", node);

    expect(spy).toHaveBeenCalled();
    expect(spy.mostRecentCall.args[0].templateConfig).toBe('default');
  });

  it("should throw an error when trying to create a asset without required data", function() {
    expect(function() { f.createPage('node', {}); }).toThrow();
    expect(function() { f.createPage('node', null, 'images'); }).toThrow();
  });

  it("should throw an error if the page type is not specified", function() {
    expect(function() { f.createPage(); }).toThrow();
  });

  it("should throw an error if there is no function specified for the given type", function() {
    expect(function() { f.createPage("nonexistent"); }).toThrow();
  });

  it("should throw an error if the controller associated with the node does not exist", function() {
    expect(function() {
      f.createPage('node', { pageController : 'nonexistent' });
    }).toThrow();
  });

  it("should map videos template properly", function() {
    toura.templates.Videos1 = { screens: [{}] };
    dojo.forEach([
      'videos-and-text-phone',
      'videos-and-text-tablet'
    ], function(name) {
      var controller = f.createPage({ pageController: {fake: name} });
      expect(controller.templateName).toBe('Videos1');
    });
  });

});
