dojo.provide('toura.models._Updateable');

dojo.require('toura.app.DeviceStorage');
dojo.require('dojo.io.script');

/**
 * @class toura.models._Updateable
 *
 * A base class for any updateable resource.
 */
dojo.declare('toura.models._Updateable', [], {
  /**
   * The location of the bundled data, if any
   * @optional
   */
  bundleDataUrl : '',

  /**
   * The location of the remote data
   * @required
   */
  remoteDataUrl : '',

  /**
   * The location of the remote version information
   * @required
   */
  remoteVersionUrl : '',

  /**
   * A storage key prefix for storing the version in local storage.
   * @required
   */
  storageKey : '',

  /**
   * An integer indicating when the remote was last checked for a new version.
   */
  lastChecked : 0,

  /**
   * @constructor
   */
  constructor : function(config) {
    dojo.mixin(this, config);
  },

  /**
   * @public
   *
   * This method allows consumers to request the items associated with the
   * updateable resource. It must be implemented by subclasses.
   *
   * @returns {Array} An array of items.
   */
  getItems : function() {
    console.warn('The getItems method has not been implemented by ', this.declaredClass);
    return this._items || [];
  },

  /**
   * @public
   *
   * This method ensures that bundled data has been loaded into the
   * application, and then checks to see whether there is newer data available
   * on the remote. If there is newer data available, then the local data is
   * replaced with the newer data.
   *
   * @returns {Promise} A promise that, if resolved, will be resolved with a
   * boolean value. If the value is true, then the data was updated during the
   * bootstrapping process.
   */
  bootstrap : function() {
    console.log('toura.models._Updateable::bootstrap()');

    var localVersion = this._getLocalVersion(),
        dfd = this.deferred = new dojo.Deferred();

    dojo.when(
      // if localVersion is null, then this is the first boot,
      // so we need to initialize the data; otherwise, we can
      // proceed with updating if necessary
      localVersion === null ? this._initializeData() : true,
      dojo.hitch(this, '_updateIfNecessary')
    ).then(dojo.hitch(this, '_onUpdate'));

    return dfd.promise;
  },

  _onUpdate : function(remoteData) {
    if (remoteData) {
      if (remoteData.appVersion && this._isAppVersionCompatible(remoteData.appVersion)) {
        // if there was remote data, we need to store it
        dojo.when(this._store(remoteData), dojo.hitch(this, function() {
          // once we've stored it, we have a chance to run a hook
          this._onDataReady();

          // finally, we're done -- we resolve true to indicate we
          // updated the data successfully
          this.deferred.resolve(true);
        }));
      } else {
        // not storing remote data so resolve false
        this.deferred.resolve(false);
      }
    } else {
      this.deferred.resolve(false);
    }
  },

  _isAppVersionCompatible: function(versionString) {
    var appVersion = toura.app.Config.get('appVersion'),
        appMajorVersion = this._parseMajorVersion(appVersion);

    return appMajorVersion === this._parseMajorVersion(versionString);
  },

  _updateIfNecessary : function() {
    // update the local version if it was originally < 0
    var dfd = new dojo.Deferred(),
        localVersion = this._getLocalVersion();

    dojo.when(
      // first, get the remote version
      this._getRemoteVersion(),

      // once we have the remote version ...
      dojo.hitch(this, function(remoteVersionData) {
        var appMajorVersion = this._parseMajorVersion(toura.app.Config.get('appVersion'));

        if (remoteVersionData) {
          remoteVersionData.appVersion = remoteVersionData.appVersion || "2.0";
        }

        // check that app and remote major versions are compatible and that
        // remote version is newer than the local version or local version is null.
        if (
           remoteVersionData &&
           this._isAppVersionCompatible(remoteVersionData.appVersion) &&
           (remoteVersionData.version > localVersion)
        ) {

          // if the remote version is newer, we need to fetch new data from the remote
          this._getRemoteData()
            .then(
              // once we have new remote data ...
              dojo.hitch(this, function(remoteData) {
                if (!remoteData) {
                  // if it was empty for some reason, we're done
                  dfd.resolve(false);
                  return;
                }
                dfd.resolve(remoteData);
              })
            );
        } else {
          // if the remote version isn't newer, the local data we have is fine

          // again, we have a chance to run a hook if we need
          this._onDataReady();

          // since we didn't update the data, we resolve the dfd false
          dfd.resolve(false);
        }
      }),

      // ... hm, we did not get the remote version
      dojo.hitch(this, function(error) {
        // 404 or 503 OK, proceed as if there is no update
        if (error.status === 404 || error.status === 503) {
          // again, we have a chance to run a hook if we need
          this._onDataReady();
        }
        dfd.resolve(false);
      })
    );

    return dfd.promise;
  },

  /**
   * @private
   * @param {String} url The url for the request
   * @param {Object} dfd The deferred that should be rejected or resolved
   * @returns {XHR} A configuration object for passing to dojo.xhrGet
   */
  _xhr : function(url, dfd) {
    return dojo.xhrGet({
      url : url,
      preventCache : true,
      handleAs : 'json',
      contentType : false,
      load : dfd.resolve,
      error : dfd.reject
    });
  },

  /**
   * @private
   * @returns {Promise} A promise that, if resolved, will be resolved with the
   * current version of the remote data.
   */
  _getRemoteVersion : function() {
    this.lastChecked = new Date().getTime();

    var dfd = new dojo.Deferred();

    if (toura.skipVersionCheck || !this.remoteVersionUrl) {
      console.log('No remote version URL -- skipping remote version check');
      dfd.resolve(null);
    } else {
      toura.app.PhoneGap.network.isReachable()
        .then(
          dojo.hitch(this, function(isReachable) {
            if (!isReachable) {
              dfd.resolve(null);
              return;
            }

            this._xhr(this.remoteVersionUrl, dfd);
          }),

          dfd.reject
        );
    }

    return dfd.promise;
  },

  /**
   * @private
   * @returns {Number} The current local version, or -1 if there is no current
   * local version.
   */
  _getLocalVersion : function() {
    var v = toura.app.DeviceStorage.get(this.storageKey + '-version');
    return v;
  },

  /**
   * @private
   */
  _setLocalVersion : function(v) {
    toura.app.DeviceStorage.set(this.storageKey + '-version', v);
  },


  /**
   * @private
   * @returns {Promise} A promise that, if resolved, will be resolved with the
   * remote data.
   */
  _getRemoteData : function() {
    var dfd = new dojo.Deferred();

    if (!this.remoteDataUrl) {
      console.log('No remote data URL -- skipping remote data check');
      dfd.resolve(false);
    } else {
      toura.app.PhoneGap.network.isReachable()
        .then(
          dojo.hitch(this, function() {
            this._xhr(this.remoteDataUrl, dfd);
          }),
          function() {
            dfd.resolve(false);
          }
        );
    }

    return dfd.promise;
  },

  /**
   * @private
   * @returns {Object} The bundled data
   */
  _getBundleData : function() {
    var dfd = new dojo.Deferred();

    if (!this.bundleDataUrl) {
      dfd.resolve();
    }

    dojo.io.script.get({
      url : this.bundleDataUrl,
      preventCache : true
    }).then(
      dojo.hitch(this, function(bundleData) {
        dfd.resolve(this._processBundleData(bundleData));
      }),
      function() { dfd.reject('Could not load local bundle data'); }
    );

    return dfd.promise;
  },

  /**
   * @private
   *
   * This method is run once the bundled data has been loaded. Because bundled
   * data is formatted as a regular JavaScript file, not as JSON, it generally
   * assigns the data to a location in the toura namespace (for example, to
   * toura.data.local). This method should be implemented by subclasses so they
   * can specify this location once the data has been loaded; subclasses should
   * return the data:
   *
   *   return toura.data.local;
   *
   * The returned data will be used by _getBundleData to resolve its deferred.
   *
   * @returns {Object}
   */
  _processBundleData : function(data) {
    console.warn('_processBundleData was not implemented by', this.declaredClass);
    return data;
  },

  /**
   * @private
   *
   * This method loads and stores the bundled data.
   *
   * @returns {Promise}
   */
  _initializeData : function() {
    var dfd = new dojo.Deferred();

    this._getBundleData().then(

      dojo.hitch(this, function(data) {

        console.log('toura.models._Updateable::_initializeData() got', data);

        if (!data) {
          dfd.resolve(false);
          return;
        }

        dojo.when(this._store(data), function() {
          dfd.resolve(true);
        });

      })

    );

    return dfd.promise;
  },

  /**
   * @private
   *
   * Instructions for storing the data. This should be extended by
   * subclasses if necessary.
   */
  _store : function(sourceData) {
    this.lastUpdated = new Date().getTime();
    this._items = sourceData.items;
    this._setLocalVersion(sourceData && sourceData.version);
  },

  /**
   * @private
   *
   * Parse the major version out of a version string as a number.
   */
  _parseMajorVersion: function(versionString) {
    return +versionString.split('.')[0];
  },

  /**
   * @private
   *
   * Things to do once we know the data's ready -- to be implemented by
   * subclasses if necessary.
   */
  _onDataReady : function() { }

});

