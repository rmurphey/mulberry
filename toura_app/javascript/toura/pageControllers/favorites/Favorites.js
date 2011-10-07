dojo.provide('toura.pageControllers.favorites.Favorites');

dojo.require('toura.app.user.Favorites');
dojo.require('toura.components.Favorites');
dojo.require('toura.pageControllers._Page');
dojo.require('toura.components.PageNav');

dojo.declare('toura.pageControllers.favorites.Favorites', [ toura.pageControllers._Page ], {
  templateString : dojo.cache('toura.pageControllers.favorites', 'Favorites/Favorites.haml'),

  postMixInProperties :  function() {
    this.placements = [
      [
        'Favorites',
        { favorites : toura.app.user.Favorites.load() },
        'favorites',
        'replace'
      ]
    ];

    this.inherited(arguments);
  },

  setupNav : function() {
    this.adopt(toura.components.PageNav, {
      shareable : false,
      title: this.i18n_favorites
    }).placeAt(this.pageNav, 'replace');
  },

  initializeStrings : function() {
    this.i18n_favorites = this.getString('FAVORITES');
  }
});
