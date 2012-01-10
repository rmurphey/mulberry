dojo.provide('toura.app.Router');

dojo.require('toura.app.PhoneGap');
dojo.require('dojo.hash');

/**
 * toura.Router provides an API for specifying hash-based URLs
 * ("routes") and the functionality associated with each. It allows
 * the routes to include both path and query string parameters which
 * are then available inside the handling function:
 *
 *    /things/:id     ->    #/things/3
 *    /things         ->    #/things?id=3&color=red
 *
 * Defining a route involves providing a string route matcher, and
 * a function to run for the route. The function receives two arguments:
 * an object containing the parameters associated with the route, if any;
 * and a route object with information about the route itself.
 *
 * The concept for this class is based largely on the wonderful
 * Sammy.js, a jQuery-based framework for accomplishing all of this and
 * more. See http://code.quirkey.com/sammy/ for details.
 *
 * @author rmurphey
 */

(function(d) {
  d.declare('toura.app.Router', null, {
    QUERY_STRING_MATCHER : /\?([^#]*)$/,
    PATH_REPLACER : "([^\/]+)",
    PATH_NAME_MATCHER : /:([\w\d]+)/g,

    _routes : [],

    _cache : {},
    _currentHash : null,

    // yay feature detection!
    _hasHistoryState : !!(history.pushState && history.replaceState),

    /**
     * Initializes the router and routes the current URL.
     * This should be run after all routes have been defined.
     */
    init : function() {
      if (!this.defaultRoute) {
        console.error("No default route provided to router.");
        throw new Error("No default route provided to router.");
      }

      var hash = window.location.hash.toString(),
          loc = hash.replace('#','') || this.defaultRoute.origRoute;

      this.go(loc);

      d.subscribe('/dojo/hashchange', this, '_handleHash');

      if (this._hasHistoryState) {
        d.connect(window, 'onpopstate', this, function() {
          var hash = window.location.hash.replace('#','');
          this._handleHash(hash);
        });
      }
    },

    /**
     * Redirects the application to a new hash.
     * @param {String} loc The location to redirect to.
     */
    go : function(loc, replace, state) {
      var hash = loc.replace('#', ''),
          urlHash;

      if (this._hasHistoryState) {
        history[ replace ? 'replaceState' : 'pushState' ](state, null, '#' + hash);
        // history[replace ? 'replaceState' : 'pushState'](null, null, '#' + hash);
        this._handleHash(hash);
      } else {
        window.location.hash = hash;
        this._handleHash(hash);
      }
    },

    /**
     * @public
     * Sets the navigation state to back and navigates to the previous state in
     * the browser history.
     */
    back : function() {
      toura.app.UI.set('navDirection', 'back');
      history.back();
    },

    /**
     * @public
     * Sets the navigation state to back and navigates to the home page.
     */
    home : function() {
      toura.app.UI.set('navDirection', 'back');
      this.go('/home');
    },

    /**
     * Identifies and runs the route that matches the current hash
     * @private
     * @param {String} hash The current hash, as provided by the /dojo/hashchange topic
     */
    _handleHash : function(hash) {
      if (hash === this._currentHash) {
        console.log('>>> hash is a dupe, ignoring: ' + hash);
        return;
      }

      this._currentHash = hash;

      toura.logSection('Handling ' + hash);

      var route = this.currentRoute = this._lookupRoute(hash),
          params,
          proceed = true;

      hash = hash.replace('#','');

      if (!route) {
        console.log('No route found for hash ' + hash);
        this.go(this.defaultRoute.origRoute);
        return;
      }

      params = this._parseParamsFromHash(hash);
      params.pageState = window.history.state;
      route = d.mixin(route, { hash : hash });

      route.callback(params, route);

      d.publish('/router/handleHash/after');
      toura.endLogSection('Handling ' + hash);
    },

    /**
     * Creates a params object based on a hash
     * @private
     * @param {String} hash The hash to parse
     * @returns Params object containing all params from hash
     * @type Object
     */
    _parseParamsFromHash : function(hash) {
      var parts = hash.split('?'),
          path = parts[0],
          query = parts[1],
          params,
          pathParams,
          _decode = decodeURIComponent,
          route = this.currentRoute;

      params = query ? d.mixin({}, d.queryToObject(query)) : {};

      if ((pathParams = route.path.exec(this._routeablePath(path))) !== null) {
        // first match is the full path
        pathParams.shift();

        // for each of the matches
        d.forEach(pathParams, function(param, i) {
          // if theres a matching param name
          if (route.paramNames[i]) {
            // set the name to the match
            params[route.paramNames[i]] = _decode(param);
          } else {
            // initialize 'splat'
            if (!params.splat) { params.splat = []; }
            params.splat.push(_decode(param));
          }
        });
      }

      return params;
    },

    /**
     * Finds a route that matches the provided hash
     * @private
     * @param {String} hash The hash to find a route for
     * @returns A route object for the hash, or the default route object if no match is found
     * @type Object
     */
    _lookupRoute : function(hash) {
      if (!this._cache[hash]) {
        d.forEach(this._routes, function(route) {
          if (this._routeablePath(hash).match(route.path)) {
            this._cache[hash] = route;
          }
        }, this);
      }

      return this._cache[hash];
    },

    /**
     * Converts a hash into a string suitable for matching against a route definition
     * @private
     * @param {String} hash The hash to convert
     * @returns A string with query params removed
     * @type String
     */
    _routeablePath : function(hash) {
      return hash.replace(this.QUERY_STRING_MATCHER, '');
    },

    /**
     * @private
     * Registers a route definition with the router
     * @param {String|RegEx} route The route definition string. This can include
     * parameter names, prefixed by a colon. It must NOT include the # symbol
     * at the beginning; this is assumed. For example, a route definition string
     * can look like '/foo' or '/foo/:id' or even '/foo/:id/bar/:thing'
     * @param {Function} fn The function to run for the route. This function
     * receives one argument: an object containing the params parsed from the hash.
     * @param {Boolean} defaultRoute Whether the route should be used
     * as the default route.
     */
    registerRoute : function(route, fn, defaultRoute) {
      var pathMatch,
          paramNames = [],
          origRoute = route,
          r;

      this.PATH_NAME_MATCHER.lastIndex = 0;

      while ((pathMatch = this.PATH_NAME_MATCHER.exec(route)) !== null) {
        paramNames.push(pathMatch[1]);
      }

      // replace with the path replacement
      route = d.isString(route) ?
        new RegExp("^" + route.replace(this.PATH_NAME_MATCHER, this.PATH_REPLACER) + "$") :
        route;

      r = {
        origRoute : origRoute,
        path : route,
        callback : fn,
        paramNames : paramNames
      };

      this._routes.push(r);

      if (defaultRoute) {
        // last default route wins
        this.defaultRoute = r;
      }

      this._cache = {};
    }
  });

  toura.app.Router = new toura.app.Router();

  toura.route = function(route, handler, isDefaultRoute) {
    toura.app.Router.registerRoute(route, handler, isDefaultRoute);
  };

  toura.routes = function(routesArray) {
    dojo.forEach(routesArray, function(r) {
      toura.app.Router.registerRoute(r.route, r.handler, r.isDefault);
    });
  };
}(dojo));
