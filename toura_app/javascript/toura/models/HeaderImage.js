dojo.provide('toura.models.HeaderImage');

dojo.require('toura.models._StorableAsset');

dojo.declare('toura.models.HeaderImage', [ toura.models._StorableAsset, toura.models._CaptionedAsset ], {
  constructor : function(store, item) {
    dojo.mixin(this, {
      id : store.getValue(item, 'id'),
      name : store.getValue(item, 'name'),
      height : store.getValue(item, 'height') || null,
      width : store.getValue(item, 'width') || null
    });

    this._getUrl(store, item);
    this._processCaption(store, item);

    this.destination = /^http/.test(this.name) ? this.name : false;
  }
});
