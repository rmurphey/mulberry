dojo.provide('mulberry.components.buttons.MoreDrawerButton');

dojo.require('mulberry.components.buttons._Button');

dojo.declare('mulberry.components.buttons.MoreDrawerButton', mulberry.components.buttons._Button, {
  initializeStrings : function() {
    this.i18n_text = this.getString('MORE');
  }
});
