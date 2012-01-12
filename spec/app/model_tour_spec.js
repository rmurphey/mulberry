describe('toura.models.Tour', function() {
  var t, mockjax, deviceStorageInit = false;

  beforeEach(function() {
    dojo.require('toura.models.Tour');

    if (!deviceStorageInit) {
      toura.app.DeviceStorage.init('fake');
      toura.app.DeviceStorage.set('tour', [ 1, 2, 3 ]);
      deviceStorageInit = true;
    }

    mockjax = function (args) {
      var dfd = new dojo.Deferred();

      if (ajaxMocks[args.url]) {
        if (args.load) {
          args.load(ajaxMocks[args.url]);
        }

        dfd.resolve(ajaxMocks[args.url]);
      } else {
        if (args.error) {
          args.error();
        }

        dfd.reject();
      }

      return dfd;
    };

    toura.app.PhoneGap = {
      network : {
        isReachable : function() {
          var dfd = new dojo.Deferred();
          dfd.resolve(true);
          return dfd.promise;
        }
      }
    };

    dojo.xhrGet = dojo.io.script.get = mockjax;
    appMajorVersion = toura.app.Config.get('appVersion').split('.')[0] * 1;

    newerRemoteData = dojo.mixin({}, toura.data.local);
    newerRemoteData.appVersion = appMajorVersion + ".0";
    newerRemoteData.version = toura.data.local.version + 1;
    newerRemoteData.items = [ { id : 'new' } ];

    ajaxMocks = {
      'bundle' : toura.data.local,
      'remote' : newerRemoteData,
      'version' : { version : newerRemoteData.version, appVersion: appMajorVersion + ".0" }
    };

    config = {
      bundleDataUrl : 'bundle',
      remoteDataUrl : 'remote',
      remoteVersionUrl : 'version'
    };

    t = new toura.models.Tour(config);
  });

  describe("getItems", function() {
    it("should return a promise", function() {
      expect(t.getItems().then).toBeDefined();
    });
  });




});
