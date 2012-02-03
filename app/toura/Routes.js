dojo.provide('toura.Routes');

dojo.requireLocalization('mulberry', 'mulberry');
dojo.require('mulberry.Device');

(function() {
  var touraRoutes = (function() {
    var routes,
        app = function() {
          var appConfig = mulberry.app.Config.get('app');
          app = function() { return appConfig; };
          return appConfig;
        },
        device = mulberry.Device,
        appBgImg;

    function appBackgroundImage() {
      if (!appBgImg) {
        appBgImg = mulberry.app.Config.get('app').backgroundImage;

        if (appBgImg) {
          appBgImg = appBgImg[device.type];

          appBgImg = appBgImg ? toura.Data.getModel(appBgImg, 'backgroundImage')[
            device.type === 'phone' ? 'gallery' : 'original'
          ] : '';
        }
      }

      return appBgImg;
    }

    function nodeRoute(route, nodeId, pageState) {
      pageState = pageState || {};

      var nodeModel = toura.Data.getModel(nodeId),
          page = mulberry.app.UI.currentPage,
          pf, subscription;

      if (!nodeModel) {
        console.log('Request for invalid hash', route.hash);
        mulberry.app.Router.home();
        return;
      }

      if (!page || !page.node || nodeId !== page.node.id) {
        // if we don't have a page yet, if we  have a page but
        // it's not a node page, or if we have a node page but
        // it's not for the requested node ... in all of these
        // cases, we need the page factory to spin up a page
        try {
          pf = mulberry.createPage(
            dojo.mixin(nodeModel, {
              pageBackground : nodeModel.getBackgroundImage(device) || appBackgroundImage()
            })
          );
        } catch(e) {
          console.log("Toura.app.Routes: can't create a page", e, nodeModel);

          if (nodeId !== 'node-home') {
            mulberry.app.Router.back();
          }

          return;
        }

        if (pf.failure) {
          if (dojo.isString(pf.failure)) {
            mulberry.app.PhoneGap.notification.alert(pf.failure);
          }

          mulberry.app.Router.back();
          return;
        }

        pf.init(pageState);
        mulberry.app.UI.showPage(pf, nodeModel);
      } else {
        page.init(pageState);
      }

      // record node pageview if it is node-only
      if (nodeId && !pageState.assetType) {
        dojo.publish('/node/view', [ route.hash ]);
      }

      mulberry.endLogSection('NODE ROUTE');

      return true;
    }

    routes = [
      {
        route : '/home',
        handler : function(params, route) {
          toura.lastSearchTerm = null;
          return nodeRoute(route, app().homeNodeId);
        },
        isDefault : true
      },

      {
        route : '/about',
        handler : function(params, route) {
          return nodeRoute(route, app().aboutNodeId);
        }
      },

      {
        route : '/maps',
        handler : function(params, route) {
          return nodeRoute(route, app().mapNodeId);
        }
      },

      {
        route : /\/node\/(.*)/,
        handler : function(params, route) {
          var splat = params.splat[0].split('/'),
              nodeId = splat[0],
              pageState = {
                assetType : splat[1],
                assetId : splat[2],
                assetSubId : splat[3]
              };

          return nodeRoute(route, nodeId, pageState);
        }
      },

      {
        route : /\/search\/?(.*)/,
        handler : function(params) {
          var page = mulberry.app.UI.currentPage,
              term = params.splat && params.splat[0].split('/')[0];

          page = mulberry.createPage({
            pageDef : 'search',
            term : term,
            getResults : dojo.hitch(toura.Data, 'search'),
            backgroundImage : appBackgroundImage()
          });

          mulberry.app.UI.showPage(page);

          return true;
        }
      },

      {
        route : '/feed/:feedId/item/:itemIndex',
        handler : function(params) {
          var feed = toura.Data.getModel(params.feedId, 'feed'),
              feedItem = feed.getItem(params.itemIndex),
              page = mulberry.createPage(dojo.mixin(feedItem, {
                pageDef : 'feed-item',
                backgroundImage : appBackgroundImage()
              }));

          mulberry.app.UI.showPage(page, feedItem);
        }
      }
    ];

    if (mulberry.features.debugPage) {
      routes.push({
        route : '/debug/:query',
        handler : function(params, route) {
          var page = mulberry.createPage({
            pageDef : 'debug',
            name : 'Debug',
            query : params.query,
            backgroundImage : appBackgroundImage()
          });

          mulberry.app.UI.showPage(page);
        }
      });
    }

    if (mulberry.features.favorites) {
      routes.push({
        route : '/favorites',
        handler : function() {
          var page = mulberry.createPage({
            name : dojo.i18n.getLocalization(
              "mulberry", "mulberry", mulberry.app.Config.get("locale")
            ).FAVORITES,
            pageDef : 'favorites',
            favorites : toura.user.Favorites.load(),
            backgroundImage : appBackgroundImage()
          });

          mulberry.app.UI.showPage(page);
        }
      });
    }

    return routes;
  }());

  mulberry.routes(touraRoutes);

}());
