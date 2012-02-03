dojo.provide('mulberry.components.buttons.MapsButton');

dojo.require('mulberry.components.buttons._Button');

dojo.declare('mulberry.components.buttons.MapsButton', mulberry.components.buttons._Button, {
  "class" : 'maps',

  prepareData : function() {
    this.url = mulberry.app.URL.maps();
  },

  initializeStrings : function() {
    this.i18n_text = this.getString('MAPS');
  }
});

dojo.mixin(mulberry.components.buttons.MapsButton, {
  isAvailable : function() {
    var appConfig = mulberry.app.Config.get('app');
    return appConfig.mapsEnabled && !!appConfig.mapNodeId;
  }
});
