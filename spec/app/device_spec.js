describe("device object", function() {
  it("should expose information about the device", function() {
    expect(toura.Device.type).toBeDefined();
    expect(toura.Device.os).toBeDefined();
  });

  it("should set default values if none are provided by toura.app.Config", function() {
    toura.app.Config.set('device', null);
    toura._loadDeviceConfig();

    expect(toura.Device.type).toBeDefined();
    expect(toura.Device.os).toBe('browser');
  });
});
