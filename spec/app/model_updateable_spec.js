describe("Updateable", function() {
  var instance, Updateable, ajaxMocks, networkIsReachable,
      config, mockjax, newerRemoteData, appMajorVersion;

  beforeEach(function() {
    dojo.require('toura.models._Updateable');

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
          dfd.resolve(networkIsReachable);
          return dfd;
        }
      }
    };

    dojo.xhrGet = dojo.io.script.get = mockjax;
    appMajorVersion = toura.app.Config.get('appVersion').split('.')[0] * 1;

    toura.data.local.version = 1;

    newerRemoteData = dojo.mixin({}, toura.data.local);
    newerRemoteData.appVersion = appMajorVersion + ".0";
    newerRemoteData.version = toura.data.local.version + 2;
    newerRemoteData.items = [ { id : 'new remote' } ];

    ajaxMocks = {
      'bundle' : toura.data.local,
      'remote' : newerRemoteData,
      'version' : { version : newerRemoteData.version, appVersion: appMajorVersion + ".0" }
    };

    config = {
      bundleDataUrl : 'bundle',
      remoteDataUrl : 'remote',
      remoteVersionUrl : 'version',
      storageKey : 'key',
      _processBundleData : function(data) {
        return data;
      }
    };

    networkIsReachable = true;

    Updateable = toura.models._Updateable;
  });

  describe("bootstrapping", function() {
    it("should indicate when the remote was last checked", function() {
      var u = new Updateable(config),
          dfd = new dojo.Deferred();

      expect(u.lastChecked).toBeDefined();
      u.bootstrap().then(dfd.resolve);

      waitsFor(function() { return dfd.fired; });

      runs(function() {
        expect(u.lastChecked).toBeTruthy();
      });
    });

    describe("when the bundled data is newer than the stored data", function() {
      var newerBundleData;

      beforeEach(function() {
        newerBundleData = dojo.mixin({}, toura.data.local);
        newerBundleData.version = toura.data.local.version + 1;
        newerBundleData.items = [ { id : 'new bundle' } ];
      });

      it("should replace the stored data with the bundled data", function() {
        window.localStorage.clear();
        networkIsReachable = false;

        var simulatePreviousBoot = new Updateable(config).bootstrap(),
            flag;

        simulatePreviousBoot.then(function() {
          flag = true;
          ajaxMocks.bundle = newerBundleData;
        });

        waitsFor(function() { return flag; });

        runs(function() {
          var u = new Updateable(config),
              dfd = u.bootstrap(),
              flag;

          dfd.then(function() { flag = true; });

          waitsFor(function() { return flag; });

          runs(function() {
            expect(u.getItems().length).toBe(1);
            expect(u.getItems()[0].id).toBe(newerBundleData.items[0].id);
          });
        });
      });
    });

    describe("when the device is not connected to a network", function() {
      beforeEach(function() {
        networkIsReachable = false;
      });

      it("should resolve the deferred with a falsy value", function() {
        var u = new Updateable(config),
            dfd = u.bootstrap(),
            flag, bootstrapperResult;

        dfd.then(function(result) {
          flag = true;
          bootstrapperResult = result;
        });

        waitsFor(function() { return flag; }, 1000);

        runs(function() {
          expect(flag).toBeTruthy();
          expect(bootstrapperResult).toBeFalsy();
        });
      });

      it("should not try to contact the remote", function() {
        var u = new Updateable(config),
            dfd = u.bootstrap(),
            spy = spyOn(dojo, 'xhrGet'),
            flag;

        dfd.then(function(result) {
          flag = true;
        });

        waitsFor(function() { return flag; }, 1000);

        runs(function() {
          expect(spy).not.toHaveBeenCalled();
        });
      });
    });

    describe("when the device is connected to a network", function() {
      beforeEach(function() {
        networkIsReachable = true;
      });

      function itShouldLoadTheRemoteData() {

        it("should store the remote data in memory", function() {
          var u = new Updateable(config),
              dfd = u.bootstrap(),
              flag;

          dfd.then(function(result) {
            flag = true;
          });

          waitsFor(function(result) {
            return flag;
          });

          runs(function() {
            expect(u.getItems().length).toBe(1);
            expect(u.getItems()[0].id).toBe(newerRemoteData.items[0].id);
          });
        });

        it("should resolve the deferred true", function() {
          var u = new Updateable(config),
              dfd = u.bootstrap(),
              bootstrapperResult;

          dfd.then(function(result) {
            bootstrapperResult = result;
          });

          waitsFor(function() {
            return bootstrapperResult;
          });

          runs(function() {
            expect(bootstrapperResult).toBeTruthy();
          });
        });

        it("should run the _store method, which can be implemented by subclasses", function() {
          var u = Updateable(config),
              spy = spyOn(u, '_store'),
              dfd = u.bootstrap(),
              flag;

          dfd.then(function() {
            flag = true;
          });

          waitsFor(function() { return flag; });

          runs(function() {
            expect(spy).toHaveBeenCalled();
          });
        });

      }

      function itShouldNotLoadTheRemoteData() {

        it("should not load the remote data", function() {
          var u = new Updateable(config),
              spy = spyOn(u, '_getRemoteData'),
              dfd = u.bootstrap(),
              flag;

          dfd.then(function() {
            flag = true;
          });

          waitsFor(function() {
            return flag;
          });

          runs(function() {
            expect(spy).not.toHaveBeenCalled();
          });
        });

        it("should resolve the deferred false", function() {
          var u = new Updateable(config),
              dfd = u.bootstrap(),
              bootstrapperResult,
              flag;

          dfd.then(function(result) {
            flag = true;
            bootstrapperResult = result;
          });

          waitsFor(function() {
            return flag;
          });

          runs(function() {
            expect(bootstrapperResult).toBeFalsy();
          });
        });

      }

      describe("and there is newer data", function() {
        beforeEach(function() {
          ajaxMocks.version.version  = toura.data.local.version + 100;
        });

        describe("and the remote app version is the same", function() {
          itShouldLoadTheRemoteData();
        });

        describe("and the remote app version is smaller", function() {
          beforeEach(function() {
            ajaxMocks.version.appVersion =  (appMajorVersion-1) + ".0";
          });
          itShouldNotLoadTheRemoteData();
        });

        describe("and the remote app version is greater", function() {
          beforeEach(function() {
            ajaxMocks.version.appVersion =  (appMajorVersion+1) + ".0";
          });
          itShouldNotLoadTheRemoteData();
        });

        describe("and the data has a newer app version", function() {
          beforeEach(function() {
            ajaxMocks.remote.appVersion = (appMajorVersion+1) + ".0";
          });

          it("should not store the remote data", function() {
            var u = new Updateable(config),
                spy = spyOn(u, '_store'),
                dfd = u.bootstrap(),
                flag;

            dfd.then(function() {
              flag = true;
            });

            waitsFor(function() {
              return flag;
            });

            runs(function() {
              expect(spy).not.toHaveBeenCalled();
            });
          });

        });

      });

      describe("and there is not newer data", function() {
        beforeEach(function() {
          ajaxMocks.version = { version : 0 };
        });

        itShouldNotLoadTheRemoteData();

      });
    });
  });
});

