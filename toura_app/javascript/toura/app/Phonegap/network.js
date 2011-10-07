dojo.provide('toura.app.Phonegap.network');

toura.app.Phonegap.network = function(pg, device) {
  var n = navigator,
      interval = 5 * 60 * 1000,
      state,
      checked,
      reachable;

  return {
    /**
     * @public
     *
     * Whether the network is currently in a reachable state. If the method
     * reports that the network is not currently reachable, then it will cache
     * that status for 5 minutes before checking again.
     *
     * @returns {Promise} A promise that, when resolved, will resolve with a
     * boolean, with `true` indicating the network is reachable.
     */
    isReachable : function(domain) {

      console.log('toura.app.Phonegap.network::isReachable()');

      var dfd = new dojo.Deferred(),
          now = new Date().getTime();

      if (
        // we have checked for reachability before
        checked &&

        // last time we checked, it was not reachable
        !reachable &&

        // it has not been long enough since we last checked that we should
        // bother checking again
        (now - checked < interval)
      ) {
        // decide that the network is not reachable and be done with it
        dfd.resolve(reachable);
        return dfd;
      }

      checked = now;

      if (navigator.network && navigator.network.connection) {
        state = navigator.network.connection.type;

        if (state === Connection.UNKNOWN || state === Connection.NONE) {
          reachable = false;
        } else {
          reachable = true;
        }
      } else {
        reachable = true;
      }

      dfd.resolve(reachable);

      return dfd.promise;
    }
  };
};
