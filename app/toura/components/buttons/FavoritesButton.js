dojo.provide('toura.components.buttons.FavoritesButton');

dojo.require('toura.components.buttons._Button');

dojo.declare('toura.components.buttons.FavoritesButton', toura.components.buttons._Button, {
  "class" : 'favorites',

  prepareData : function() {
    this.url = toura.app.URL.favorites();
  },

  initializeStrings : function() {
    this.i18n_text = this.getString('FAVORITES');
  }
});

dojo.mixin(toura.components.buttons.FavoritesButton, {
  isAvailable : function() {
    return toura.features.favorites;
  }
});
