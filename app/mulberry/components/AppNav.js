dojo.provide('mulberry.components.AppNav');

dojo.require('mulberry._Component');
dojo.require('mulberry.components.buttons.SearchButton');
dojo.require('mulberry.components.buttons.AboutButton');
dojo.require('mulberry.components.buttons.MapsButton');
dojo.require('mulberry.components.buttons.FavoritesButton');

dojo.declare('mulberry.components.AppNav', mulberry._Component, {
  templateString : dojo.cache('mulberry.components', 'AppNav/AppNav.haml'),
  widgetsInTemplate : true,
  handleClicks : true,

  setupChildComponents : function() {
    var buttons = [
      mulberry.components.buttons.SearchButton,
      mulberry.components.buttons.AboutButton,
      mulberry.components.buttons.MapsButton,
      mulberry.components.buttons.FavoritesButton
    ];

    dojo.forEach(buttons, function(btn) {
      if ((btn.isAvailable && btn.isAvailable()) || !btn.isAvailable) {
        var li = dojo.create('li');
        this.adopt(btn).placeAt(li);
        dojo.place(li, this.buttonList, 'last');
      }
    }, this);
  }
});
