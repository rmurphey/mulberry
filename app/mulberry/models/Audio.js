dojo.provide('mulberry.models.Audio');

dojo.require('mulberry.models._CaptionedAsset');
dojo.require('mulberry.models._StorableAsset');

dojo.declare('mulberry.models.Audio', [ mulberry.models._CaptionedAsset, mulberry.models._StorableAsset ], {
  constructor : function(store, item) {
    store.fetchItemByIdentity({
      identity : item.audio._reference,
      onItem : function(item) {
        dojo.mixin(this, {
          id : store.getValue(item, 'id'),
          name : store.getValue(item, 'name')
        });
        this._getUrl(store, item);
      },
      scope : this
    });

    this._processCaption(store, item);
  }
});
