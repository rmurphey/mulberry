dojo.provide('toura.components.buttons.HomeButton');

dojo.require('toura.components.buttons._Button');

dojo.declare('toura.components.buttons.HomeButton', toura.components.buttons._Button, {
  preventWhenAnimating : true,

  onClick : function(e) {
    e.preventDefault();
    toura.app.Router.home();
  }
});
