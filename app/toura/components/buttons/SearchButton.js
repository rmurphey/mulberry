dojo.provide('toura.components.buttons.SearchButton');

dojo.require('toura.components.buttons._Button');

dojo.declare('toura.components.buttons.SearchButton', toura.components.buttons._Button, {
  "class" : 'search',
  url : toura.URL.search(),
  preventWhenAnimating : true
});

