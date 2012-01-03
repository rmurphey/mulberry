dojo.provide('toura.components._Results');

dojo.require('toura._Component');
dojo.require('toura.ui.Scrollable');
dojo.require('toura.Utilities');

dojo.declare('toura.components._Results', [ toura._Component, toura.ui.Scrollable ], {
  postCreate : function() {
    this.inherited(arguments);
    this.refreshScroller();
  },

  _truncate : function(text) {
    return toura.util.truncate(text, 200);
  }
});
