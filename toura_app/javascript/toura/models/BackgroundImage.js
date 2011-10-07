dojo.provide('toura.models.BackgroundImage');

dojo.require('toura.models._StorableAsset');

dojo.declare('toura.models.BackgroundImage', [ toura.models._StorableAsset ], {
  constructor : function(store, item) {
    dojo.mixin(this, {
      id : store.getValue(item, 'id'),
      name : store.getValue(item, 'name'),
      height : store.getValue(item, 'height') || null,
      width : store.getValue(item, 'width') || null
    });

    this._getUrl(store, item);
  }
});
