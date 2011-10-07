dojo.provide('toura.models.GoogleMapPin');

dojo.require('toura.models._CaptionedAsset');

dojo.declare('toura.models.GoogleMapPin', [ toura.models._CaptionedAsset ], {
  constructor : function(store, item) {
    store.fetchItemByIdentity({
      identity : item.google_map_pin._reference,
      onItem : function(item) {
        dojo.mixin(this, {
          id : store.getValue(item, 'id'),
          name : store.getValue(item, 'name'),
          lat : store.getValue(item, 'lat'),
          lon : store.getValue(item, 'lon'),
          address : store.getValue(item, 'address'),
          phoneNumber : store.getValue(item, 'phone_number'),
          website : store.getValue(item, 'website')
        });
      },
      scope : this
    });

    this._processCaption(store, item);
  }
});
