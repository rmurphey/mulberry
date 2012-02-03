dojo.provide('mulberry.components.PageNav');

dojo.require('mulberry._Component');
dojo.require('mulberry.components.MoreDrawer');
dojo.require('mulberry.components.buttons.MoreDrawerButton');
dojo.require('mulberry.components.buttons.HomeButton');
dojo.require('mulberry.components.buttons.BackButton');
dojo.require('mulberry.app.URL');

dojo.declare('mulberry.components.PageNav', mulberry._Component, {
  templateString : dojo.cache('mulberry.components', 'PageNav/PageNav.haml'),
  widgetsInTemplate : true,
  shareable : true,

  prepareData : function() {
    this.searchUrl = mulberry.app.URL.search();
    this.homeUrl = mulberry.app.URL.home();

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
