describe("toura ui", function() {
  beforeEach(function() {
    mulberry.app.PhoneGap = {
      present : true
    };

    dojo.require('toura.UI');
  });

  it("should add classes for feature flags to the body", function() {
    var b = dojo.body();

    toura.features = {
      foo : true,
      baz : false
    };

    dojo.publish('/app/deviceready');

    expect(dojo.hasClass(b, 'feature-foo')).toBeTruthy();
    expect(dojo.hasClass(b, 'feature-bar')).toBeFalsy();
  });
});
