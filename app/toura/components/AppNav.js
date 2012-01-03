dojo.provide('toura.components.AppNav');

dojo.require('toura._Component');
dojo.require('toura.components.buttons.SearchButton');
dojo.require('toura.components.buttons.AboutButton');
dojo.require('toura.components.buttons.MapsButton');
dojo.require('toura.components.buttons.FavoritesButton');

dojo.declare('toura.components.AppNav', toura._Component, {
  templateString : dojo.cache('toura.components', 'AppNav/AppNav.haml'),
  widgetsInTemplate : true,
  handleClicks : true,

  setupChildComponents : function() {
    var buttons = [
      toura.components.buttons.SearchButton,
      toura.components.buttons.AboutButton,
      toura.components.buttons.MapsButton,
      toura.components.buttons.FavoritesButton
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
