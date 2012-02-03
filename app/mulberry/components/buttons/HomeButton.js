dojo.provide('mulberry.components.buttons.HomeButton');

dojo.require('mulberry.components.buttons._Button');

dojo.declare('mulberry.components.buttons.HomeButton', mulberry.components.buttons._Button, {
  preventWhenAnimating : true,

  onClick : function(e) {
    e.preventDefault();
    mulberry.app.Router.home();
  }
});
