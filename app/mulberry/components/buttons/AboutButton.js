dojo.provide('mulberry.components.buttons.AboutButton');

dojo.require('mulberry.components.buttons._Button');

dojo.declare('mulberry.components.buttons.AboutButton', mulberry.components.buttons._Button, {
  "class" : 'about',

  prepareData : function() {
    this.url = mulberry.app.URL.about();
  },

  initializeStrings : function() {
    this.i18n_text = this.getString('ABOUT');
  }
});

dojo.mixin(mulberry.components.buttons.AboutButton, {
  isAvailable : function() {
    var appConfig = mulberry.app.Config.get('app');
    return appConfig.aboutEnabled && !!appConfig.aboutNodeId;
  }
});

