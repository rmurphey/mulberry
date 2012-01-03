dojo.provide('toura.models.Image');

dojo.require('toura.models._CaptionedAsset');
dojo.require('toura.models._StorableAsset');

dojo.declare('toura.models.Image', [ toura.models._CaptionedAsset, toura.models._StorableAsset ], {
  constructor : function(store, item) {
    store.fetchItemByIdentity({
      identity : item.image._reference,
      onItem : function(item) {
        dojo.mixin(this, {
          id : store.getValue(item, 'id'),
          name : store.getValue(item, 'name'),
          height : store.getValue(item, 'height') || null,
          width : store.getValue(item, 'width') || null
        });
        this._getUrl(store, item);
      },
      scope : this
    });

    this._processCaption(store, item);
  }
});


