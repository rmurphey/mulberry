dojo.provide('mulberry.components.MoreDrawer');

dojo.require('mulberry._Component');
dojo.require('mulberry.app.PhoneGap');
dojo.require('mulberry.app.Sharing');
dojo.require('mulberry.app.user.Favorites');
dojo.require('mulberry.components.buttons.HomeButton');
dojo.require('mulberry.components.buttons.SearchButton');
dojo.require('mulberry.components.buttons.FontSize');
dojo.require('mulberry.components.SocialMessage');

dojo.declare('mulberry.components.MoreDrawer', mulberry._Component, {
  templateString : dojo.cache('mulberry.components', 'MoreDrawer/MoreDrawer.haml'),

  helpers : {
    sharingButtons : dojo.cache('mulberry.components', 'MoreDrawer/_SharingButtons.haml'),
    favoriteButton : dojo.cache('mulberry.components', 'MoreDrawer/_FavoriteButton.haml'),
    homeButton : dojo.cache('mulberry.components', 'MoreDrawer/_HomeButton.haml'),
    fontSizeButton : dojo.cache('mulberry.components', 'MoreDrawer/_FontSizeButton.haml'),
    searchButton : dojo.cache('mulberry.components', 'MoreDrawer/_SearchButton.haml')
  },

  widgetsInTemplate : true,

  isHidden : true,

  prepareData : function() {
    this.sharingDisabled = !mulberry.features.sharing;
    this.favoritesDisabled = !mulberry.features.favorites;
    this.fontSizeDisabled = !mulberry.features.fontSize;

    if (!this.sharingDisabled) {
      this.socialMediaServices = mulberry.app.Sharing.getServices();

      if (!this.socialMediaServices.length) {
        this.sharingDisabled = true;
      }
    }

    this.helpers.sharingButtons = this.sharingDisabled ? '' : this.helpers.sharingButtons;
    this.helpers.favoriteButton = this.favoritesDisabled ? '' : this.helpers.favoriteButton;
    this.helpers.fontSizeButton = this.fontSizeDisabled ? '' : this.helpers.fontSizeButton;

    this.inherited(arguments);
  },

  setupConnections : function() {
    var touch = mulberry.app.UI.hasTouch,
        evt = touch ? 'touchstart' : 'click',
        prevent = function(e) { e.preventDefault(); };

    if (!this.sharingDisabled) {
      dojo.forEach(this.socialMediaServices, function(service) {
        var socialButton = this[service.name];
        if (!socialButton) { return; }
        this.connect(socialButton, evt, dojo.hitch(this, '_handleSocialMessageClick', service));
        if (touch) { this.connect(socialButton, 'click', prevent); }
      }, this);

      this._createMailLink();
      this.hide(this.shareSection);
    }

    if (!this.favoritesDisabled) {
      // set up favorite button
      this.connect(this.favorite, evt, '_handleFavorite');

      if (touch) {
        this.connect(this.favorite, 'click', prevent);
      }
    }
  },

  adjustMarkup : function() {
    if (this.sharingDisabled) { return; }

    dojo.forEach(['facebook', 'twitter'], function(svcName) {
      var enabled = dojo.filter(this.socialMediaServices, function(svc) {
        return svc.name === svcName;
      });

      if (!enabled.length) {
        dojo.destroy(this.query('.' + svcName)[0]);
      }
    }, this);
  },

  _createMailLink : function() {
    if (!this.email) { return; }
    dojo.attr(this.email, 'href', 'mailto:?' + dojo.objectToQuery({
      subject : mulberry.app.Config.get('app').name,
      body : mulberry.app.Sharing.getMessage('email', this.node)
    }));

    this.connect(this.email, 'click', function() {
      dojo.publish('/share', [
        [ 'email', this.node.id ].join(': ')
      ]);
    });
  },

  _handleSocialMessageClick : function(service) {
    console.log('mulberry.components.MoreDrawer::_handleSocialMessageClick()');

    mulberry.app.PhoneGap.network.isReachable().then(dojo.hitch(this, function(isReachable) {
      if (!isReachable) {
        mulberry.app.PhoneGap.notification.alert(this.i18n_noNetwork);
        return;
      }

      if (this.socialMessage) {
        var same = this.socialMessage.name === service.name;

        this.orphan(this.socialMessage, true);
        delete this.socialMessage;

        if (same) {
          dojo.removeClass(this[service.name], 'active');
          return;
        }
      }

      // mark which button was clicked
      dojo.addClass(this[service.name], 'active');

      var params = dojo.mixin({
            messageText : mulberry.app.Sharing.getMessage(service.name, this.node)
          }, service),

          socialMessage = this.socialMessage =
          this.adopt(mulberry.components.SocialMessage, params);

      socialMessage.placeAt(this.shareSection);
      this.show(this.shareSection);

      this.connect(socialMessage, 'onSubmit', function(params) {
        mulberry.app.Sharing.share(service, params, this.node)
          .then(
            // sharing was successful
            dojo.hitch(this, function() {
              this.hide(this.shareSection);
            }),
            // sharing failed
            function(msg) {
              // TODO: i18n
              if (msg) { mulberry.app.PhoneGap.notification.alert(msg); }
            }
          );
      });

      this.connect(socialMessage, 'onCancel', function() {
        this.hide(this.shareSection);
        this.orphan(socialMessage, true);
        delete this.socialMessage;
      });
    }), function() {
      mulberry.app.PhoneGap.notification.alert(this.i18n_noNetwork);
    });
  },

  _handleFavorite : function(e) {
    console.log('mulberry.components.MoreDrawer::_handleFavorite');

    if (!this.node) { return; }

    var n = this.node,
        isFav = mulberry.app.user.Favorites.isFavorite(n),
        topic = '/favorite/' + (isFav ? 'remove' : 'add');

    dojo.publish(topic, [ n ]);
    this.favorite.checked = !isFav;
  },

  _setNodeAttr : function(node) {
    this.node = node;
    if (this.favorite) {
      this.favorite.checked = mulberry.app.user.Favorites.isFavorite(node);
    }
  },

  toggle : function() {
    if (!this.isHidden) {
      dojo.publish('/MoreDrawer/hide');
      this.hide(this.shareSection);
    } else {
      dojo.publish('/MoreDrawer/show');
    }

    this.inherited(arguments);
  },

  initializeStrings : function() {
    this.i18n_noNetwork = this.getString('NO_NETWORK');
  }

});
