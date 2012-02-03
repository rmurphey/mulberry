dojo.provide('mulberry.models.HeaderImage');

dojo.require('mulberry.models._StorableAsset');

dojo.declare('mulberry.models.HeaderImage', [ mulberry.models._StorableAsset, mulberry.models._CaptionedAsset ], {
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
