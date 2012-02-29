dojo.provide('client.components.PageHeader');

mulberry.component('PageHeader', {
  componentTemplate : dojo.cache('client.components', 'PageHeader/PageHeader.haml'),

  prep : function() {
    this.title = this.node ? this.node.name : this.title;
  }
});
