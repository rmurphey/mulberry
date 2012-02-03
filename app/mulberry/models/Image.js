dojo.provide('mulberry.models.Image');

dojo.require('mulberry.models._CaptionedAsset');
dojo.require('mulberry.models._StorableAsset');

dojo.declare('mulberry.models.Image', [ mulberry.models._CaptionedAsset, mulberry.models._StorableAsset ], {
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


