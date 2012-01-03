dojo.provide('toura.components.buttons.MapsButton');

dojo.require('toura.components.buttons._Button');

dojo.declare('toura.components.buttons.MapsButton', toura.components.buttons._Button, {
  "class" : 'maps',

  prepareData : function() {
    this.url = toura.app.URL.maps();
  },

  initializeStrings : function() {
    this.i18n_text = this.getString('MAPS');
  }
});

dojo.mixin(toura.components.buttons.MapsButton, {
  isAvailable : function() {
    var appConfig = toura.app.Config.get('app');
    return appConfig.mapsEnabled && !!appConfig.mapNodeId;
  }
});
