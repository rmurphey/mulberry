dojo.provide('client.components.SecretAgent');

dojo.declare('client.components.SecretAgent', [ toura.components._Component ], {
  postCreate : function() {
    var names = this.node.data[0],
        rand = Math.floor(Math.random() * names.length);

    this.domNode.innerHTML = names[rand];
  }
});
