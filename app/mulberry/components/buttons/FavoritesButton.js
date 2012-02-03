dojo.provide('mulberry.components.buttons.FavoritesButton');

dojo.require('mulberry.components.buttons._Button');

dojo.declare('mulberry.components.buttons.FavoritesButton', mulberry.components.buttons._Button, {
  "class" : 'favorites',

  prepareData : function() {
    this.url = mulberry.app.URL.favorites();
  },

  initializeStrings : function() {
    this.i18n_text = this.getString('FAVORITES');
  }
});

dojo.mixin(mulberry.components.buttons.FavoritesButton, {
  isAvailable : function() {
    return mulberry.features.favorites;
  }
});
