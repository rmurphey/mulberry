dojo.provide('toura.app.PhoneGap.network');

toura.app.PhoneGap.network = function(pg, device) {
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
    isReachable : function() {

      console.log('toura.app.PhoneGap.network::isReachable()');

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
    },

    state : function() {
      var states = {},
          type;

      if (navigator.network && navigator.network.connection) {
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.NONE]     = 'No network connection';

        type = navigator.network.connection.type;

        return {
          state : type,
          description : states[type]
        };
      } else {
        return {
          state : -1,
          description : 'Unknown connection'
        };
      }
    }
  };
};
