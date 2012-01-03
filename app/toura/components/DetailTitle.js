dojo.provide('toura.components.DetailTitle');

dojo.require('toura._Component');

dojo.declare('toura.components.DetailTitle', toura._Component, {
  templateString : dojo.cache('toura.components', 'DetailTitle/DetailTitle.haml'),

  setupConnections : function() {
    this.connect(this.closeButton, 'click', '_close');
  },

  _close : function(e) {
    // also a stub for connection
    e.preventDefault();
    this.onClose();
  },

  onClose : function() {
    // stub for connection
  },

  initializeStrings : function() {
    this.i18n_close = this.getString('CLOSE');
  },

  attributeMap : {
    screenTitle : {
      node : 'titleElement',
      type : 'innerHTML'
    }
  }
});
