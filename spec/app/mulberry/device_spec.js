describe("device object", function() {
  it("should expose information about the device", function() {
    expect(mulberry.Device.type).toBeDefined();
    expect(mulberry.Device.os).toBeDefined();
  });

  it("should set default values if none are provided by mulberry.app.Config", function() {
    mulberry.app.Config.set('device', null);
    mulberry._loadDeviceConfig();

    expect(mulberry.Device.type).toBeDefined();
    expect(mulberry.Device.os).toBe('browser');
  });
});
