dojo.provide('toura.models.TextAsset');

dojo.declare('toura.models.TextAsset', [], {
  constructor : function(store, item) {
    dojo.mixin(this, {
      id : store.getValue(item, 'id'),
      body : store.getValue(item, 'body'),
      name : store.getValue(item, 'name'),
      contexts : store.getValues(item, 'contexts')
    });
  }
});
