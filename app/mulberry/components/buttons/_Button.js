dojo.provide('mulberry.components.buttons._Button');

dojo.require('mulberry._Component');
dojo.require('mulberry.app.URL');

dojo.declare('mulberry.components.buttons._Button', mulberry._Component, {
  templateString : dojo.cache('mulberry.components.buttons', '_Button/_Button.haml'),

  url : '#',
  i18n_text : '',
  preventWhenAnimating : false,

  setupConnections : function() {
    this._setupTouch(this.domNode, '_handleClick');
  },

  _handleClick : function(e) {
    if (e) {
      e.preventDefault();
    }

    if (this.preventWhenAnimating && mulberry.animating) {
      return;
    }

    this.onClick(e);
  },

  onClick : function(e) {
    if (this.url && this.url !== '#') {
      mulberry.app.Router.go(this.url);
    }
  }
});

