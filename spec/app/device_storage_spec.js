describe("mulberry device storage api", function() {
  var data, rawData, db, api;

  beforeEach(function() {
    dojo.require("mulberry.app.DeviceStorage");
    dojo.require("dojo.cache");

    data = dojo.mixin({}, toura.data.local);

    api = mulberry.app.DeviceStorage;
  });

  it("should return a database when initialized", function() {
    db = api.init('foo');

    var type = ({}).toString.call(db);

    expect(type).toEqual('[object Database]');
  });

});
