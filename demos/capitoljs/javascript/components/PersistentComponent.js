dojo.provide('client.components.PersistentComponent');

mulberry.component('PersistentComponent', {
  componentTemplate : dojo.cache('client.components', 'PersistentComponent/PersistentComponent.haml'),

  init : function() {
    this.subscribe('/header/update', '_updateHeader');
  },

  _updateHeader : function(val) {
    this.domNode.innerHTML = val;
    dojo[val ? 'removeClass' : 'addClass'](this.domNode, 'hidden');
  }
});
