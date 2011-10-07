dojo.provide('toura.components._Results');

dojo.require('toura.ui.Scrollable');
dojo.require('toura.components._Component');
dojo.require('toura.Utilities');

dojo.declare('toura.components._Results', [ toura.components._Component, toura.ui.Scrollable ], {
  postCreate : function() {
    this.inherited(arguments);
    this.refreshScroller();
  },

  _truncate : function(text) {
    return toura.util.truncate(text, 200);
  }
});
