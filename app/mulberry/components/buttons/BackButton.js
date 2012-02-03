dojo.provide('mulberry.components.buttons.BackButton');

dojo.require('mulberry.components.buttons._Button');

dojo.declare('mulberry.components.buttons.BackButton', mulberry.components.buttons._Button, {
  preventWhenAnimating : true,

  onClick : function(e) {
    e.preventDefault();

    if (mulberry.features.disableBackButton) { return; }
    mulberry.app.Router.back();
  },

  initializeStrings : function() {
    this.i18n_text = this.getString('BACK');
  }

});
