dojo.provide('toura.models.ImageMap');

dojo.declare('toura.models.ImageMap', [], {
  constructor : function(store, item) {
    dojo.mixin(this, {
      id : store.getValue(item, 'id'),
      name : store.getValue(item, 'name'),
      images : store.getValues(item, 'images')
    });
  }
});


