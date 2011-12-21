dojo.provide('toura.components.buttons.BackButton');

dojo.require('toura.components.buttons._Button');

dojo.declare('toura.components.buttons.BackButton', toura.components.buttons._Button, {
  preventWhenAnimating : true,

  onClick : function(e) {
    e.preventDefault();

    if (toura.features.disableBackButton) { return; }
    toura.app.Router.back();
  },

  initializeStrings : function() {
    this.i18n_text = this.getString('BACK');
  }

});
