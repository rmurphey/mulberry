dojo.provide('toura.components.buttons._Button');

dojo.require('toura.app.Config');
dojo.require('toura.components._Component');
dojo.require('toura.app.URL');

dojo.declare('toura.components.buttons._Button', [ toura.components._Component ], {
  templateString : dojo.cache('toura.components.buttons', '_Button/_Button.haml'),

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

    if (this.preventWhenAnimating && toura.animating) {
      return;
    }

    this.onClick(e);
  },

  onClick : function(e) {
    if (this.url && this.url !== '#') {
      toura.app.Router.go(this.url);
    }
  }
});

