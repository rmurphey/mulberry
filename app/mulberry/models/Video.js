dojo.provide('mulberry.models.Video');

dojo.require('mulberry.models._CaptionedAsset');
dojo.require('mulberry.models._StorableAsset');

dojo.declare('mulberry.models.Video', [ mulberry.models._CaptionedAsset, mulberry.models._StorableAsset ], {
  constructor : function(store, item) {
    if (!item.video) {
      dojo.mixin(this, {
        id : store.getValue(item, 'id'),
        name : store.getValue(item, 'name'),
        url : store.getValue(item, 'url')
      });

      return;
    }

    store.fetchItemByIdentity({
      identity : item.video._reference,
      onItem : function(item) {
        dojo.mixin(this, {
          id : store.getValue(item, 'id'),
          name : store.getValue(item, 'name'),
          poster : store.getValue(item, 'poster')
        });
        this._getUrl(store, item);
      },
      scope : this
    });

    this._processCaption(store, item);

    if (this.poster) {
      this.poster = this._posterOnDevice() ?
        mulberry.app.URL.storedAsset('videoPoster', this.poster.filename) :
        this.poster.url;
    }
  },

  _posterOnDevice : function() {
    var filename = this.poster.filename;

    return mulberry.app.manifest && mulberry.app.manifest.videos &&
      dojo.indexOf(mulberry.app.manifest.videos.posters || [], filename) > -1;
  }
});

