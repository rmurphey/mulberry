dojo.provide('toura.models.Data');

dojo.declare('toura.models.Data', [], {
  constructor : function(store, item) {
    store.fetchItemByIdentity({
      identity: item.dataAsset._reference,
      onItem : function(item) {
        dojo.mixin(this, {
          id : store.getValue(item, 'id'),
          name : store.getValue(item, 'name'),
          type : store.getValue(item, 'dataType'),
          json : JSON.parse(store.getValue(item, 'value'))
        });
      },
      scope : this
    });
  }
});
