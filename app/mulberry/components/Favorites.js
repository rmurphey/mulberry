dojo.provide('mulberry.components.Favorites');

dojo.require('mulberry._Component');
dojo.require('mulberry.components.buttons.DeleteButton');
dojo.require('mulberry.ui.BackgroundImage');

dojo.declare('mulberry.components.Favorites', mulberry._Component, {
  templateString : dojo.cache('mulberry.components', 'Favorites/Favorites.haml'),
  handleClicks : true,
  widgetsInTemplate : true,

  prepareData : function() {
    this.favorites = dojo.filter(this.node.favorites || [], function(fav) {
      return !fav.deleted;
    });

    this.favorites = dojo.map(this.favorites, function(fav) {
      fav.img = fav.model.featuredImage && fav.model.featuredImage.small.url;

      fav.displayText = fav.model.bodyText && fav.model.bodyText.body ?
        mulberry.util.truncate(fav.model.bodyText.body, 200) :
        false;

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

