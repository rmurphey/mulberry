dojo.provide('mulberry.components.buttons.SearchButton');

dojo.require('mulberry.components.buttons._Button');

dojo.declare('mulberry.components.buttons.SearchButton', mulberry.components.buttons._Button, {
  "class" : 'search',
  url : mulberry.app.URL.search(),
  preventWhenAnimating : true
});

