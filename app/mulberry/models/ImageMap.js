dojo.provide('mulberry.models.ImageMap');

dojo.declare('mulberry.models.ImageMap', [], {
  constructor : function(store, item) {
    dojo.mixin(this, {
      id : store.getValue(item, 'id'),
      name : store.getValue(item, 'name'),
      images : store.getValues(item, 'images')
    });
  }
});


