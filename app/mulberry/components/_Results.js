dojo.provide('mulberry.components._Results');

dojo.require('mulberry._Component');
dojo.require('mulberry.ui.Scrollable');
dojo.require('mulberry.Utilities');

dojo.declare('mulberry.components._Results', [ mulberry._Component, mulberry.ui.Scrollable ], {
  postCreate : function() {
    this.inherited(arguments);
    this.refreshScroller();
  },

  _truncate : function(text) {
    return mulberry.util.truncate(text, 200);
  }
});
