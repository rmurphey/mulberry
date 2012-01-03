dojo.provide('toura.components.buttons.MoreDrawerButton');

dojo.require('toura.components.buttons._Button');

dojo.declare('toura.components.buttons.MoreDrawerButton', toura.components.buttons._Button, {
  initializeStrings : function() {
    this.i18n_text = this.getString('MORE');
  }
});
