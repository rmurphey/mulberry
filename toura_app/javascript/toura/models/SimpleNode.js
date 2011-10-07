dojo.provide('toura.models.SimpleNode');

dojo.require('toura.app.URL');

(function() {

var cache = {};

dojo.subscribe('/tour/update', function() { cache = {}; });

dojo.declare('toura.models.SimpleNode', [], {
  constructor : function(store, item) {
    var id = store.getValue(item, 'id');
    if (cache[id]) {
      dojo.mixin(this, cache[id]);
      return;
    }

    dojo.mixin(this, {
      id : store.getValue(item, 'id'),
      name : store.getValue(item, 'name')
    });

    this.url = toura.app.URL.node(this.id);

    cache[id] = this;
  }
});

}());
