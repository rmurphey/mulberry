dojo.provide('toura.components.PageNav');

dojo.require('toura._Component');
dojo.require('toura.components.MoreDrawer');
dojo.require('toura.components.buttons.MoreDrawerButton');
dojo.require('toura.components.buttons.HomeButton');
dojo.require('toura.components.buttons.BackButton');
dojo.require('toura.app.URL');

dojo.declare('toura.components.PageNav', toura._Component, {
  templateString : dojo.cache('toura.components', 'PageNav/PageNav.haml'),
  widgetsInTemplate : true,
  shareable : true,

  prepareData : function() {
    this.searchUrl = toura.app.URL.search();
    this.homeUrl = toura.app.URL.home();

    this.title = this.node ? this.node.name : this.title;
    this.shareable = this.node && this.node.shareable;
  },

  setupConnections : function() {
    if (this.moreDrawerButton) {
      this.connect(this.moreDrawerButton, 'onClick', '_showMoreDrawer');
    }
  },

  setupSubscriptions : function() {
    this.subscribe('/button/menu', '_showMoreDrawer');
  },

  setupChildComponents : function() {
    if (this.shareable) {
      this.moreDrawer.set('node', this.node);
    }
  },

  initializeStrings : function() {
    this.i18n_more = this.getString('MORE');
  },

  _showMoreDrawer : function(e) {
    if (e) { e.preventDefault(); }
    this.moreDrawer.toggle();
  },

  attributeMap : {
    screenTitle : {
      node : 'titleElement',
      type : 'innerHTML'
    }
  }
});
