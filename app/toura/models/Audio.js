dojo.provide('toura.models.Audio');

dojo.require('toura.models._CaptionedAsset');
dojo.require('toura.models._StorableAsset');

dojo.declare('toura.models.Audio', [ toura.models._CaptionedAsset, toura.models._StorableAsset ], {
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
