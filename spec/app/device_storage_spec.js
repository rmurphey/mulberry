describe("toura database api", function() {
  var data, rawData, db, api;

  beforeEach(function() {
    dojo.require("toura.app.DeviceStorage");
    dojo.require("dojo.cache");

    data = dojo.mixin({}, toura.data.local);

    api = toura.app.DeviceStorage;
  });

  it("should return a database when initialized", function() {
    db = api.init('foo');

    var type = ({}).toString.call(db);

    expect(type).toEqual('[object Database]');
  });

});
