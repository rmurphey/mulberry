dojo.provide('toura.components._Results');

dojo.require('mulberry._Component');
dojo.require('toura.ui.Scrollable');
dojo.require('mulberry.Utilities');

dojo.declare('toura.components._Results', [ mulberry._Component, mulberry.ui.Scrollable ], {
  postCreate : function() {
    this.inherited(arguments);
    this.refreshScroller();
  },

  _truncate : function(text) {
    return mulberry.util.truncate(text, 200);
  }
});
