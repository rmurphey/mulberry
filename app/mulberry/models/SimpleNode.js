dojo.provide('mulberry.models.SimpleNode');

dojo.require('mulberry.app.URL');

(function() {

var cache = {};

dojo.subscribe('/tour/update', function() { cache = {}; });

dojo.declare('mulberry.models.SimpleNode', [], {
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

    this.url = mulberry.app.URL.node(this.id);

    cache[id] = this;
  }
});

}());
