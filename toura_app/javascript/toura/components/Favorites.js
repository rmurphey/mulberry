dojo.provide('toura.components.Favorites');

dojo.require('toura.components.buttons.DeleteButton');
dojo.require('toura.ui.BackgroundImage');
dojo.require('toura.components._Results');

dojo.declare('toura.components.Favorites', [ toura.components._Results ], {
  templateString : dojo.cache('toura.components', 'Favorites/Favorites.haml'),
  handleClicks : true,
  widgetsInTemplate : true,

  prepareData : function() {
    this.favorites = dojo.filter(this.favorites || [], function(fav) {
      return !fav.deleted;
    });

    this.favorites = dojo.map(this.favorites, function(fav) {
      fav.img = fav.model.featuredImage && fav.model.featuredImage.small.url;

      fav.displayText = fav.model.bodyText && fav.model.bodyText.body ?
        this._truncate(fav.model.bodyText.body) : false;

      return fav;
    }, this);
  },

  initializeStrings : function() {
    this.i18n_noFavorites = this.getString('FAVORITES_NO_FAVORITES');
  },

  _deleteFavorite : function(id, deleteNode) {
    dojo.publish('/favorite/remove', [ id ]);
    dojo.destroy(deleteNode.parentNode);
  }
});

