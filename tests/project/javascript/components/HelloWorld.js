dojo.provide('client.components.HelloWorld');

mulberry.component('HelloWorld', {
  componentTemplate : dojo.cache('client.components', 'HelloWorld/HelloWorld.haml'),

  prep : function() {
    this.connect(this.page, 'init', '_init');
  },

  _init : function(params) {
    if (params.str) {
      this.domNode.innerHTML = "Hello, " + params.str;
    }
  }
});
