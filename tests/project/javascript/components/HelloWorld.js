dojo.provide('client.components.HelloWorld');

mulberry.component('HelloWorld', {
  componentTemplate : dojo.cache('client.components', 'HelloWorld/HelloWorld.haml'),

  prep : function() {
    this.connect(this.page, 'init', '_init');
  },

  _init : function(str) {
    if (dojo.isString(str)) {
      this.domNode.innerHTML = "Hello, " + str;
    }
  }
});
