dojo.provide('toura.models._CaptionedAsset');

dojo.declare('toura.models._CaptionedAsset', [], {
  _processCaption : function(store, item) {
    if (!item.caption) { return; }

    store.fetchItemByIdentity({
      identity : item.caption._reference,
      onItem : function(item) {
        dojo.mixin(this, {
          caption : store.getValue(item, 'body'),
          name : store.getValue(item, 'name') || this.name
        });
      },
      scope : this
    });
  }
});
