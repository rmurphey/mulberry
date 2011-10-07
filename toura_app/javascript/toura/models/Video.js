dojo.provide('toura.models.Video');

dojo.require('toura.models._CaptionedAsset');
dojo.require('toura.models._StorableAsset');

dojo.declare('toura.models.Video', [ toura.models._CaptionedAsset, toura.models._StorableAsset ], {
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
        toura.app.URL.storedAsset('videoPoster', this.poster.filename) :
        this.poster.url;
    }
  },

  _posterOnDevice : function() {
    var filename = this.poster.filename;

    return toura.app.manifest && toura.app.manifest.videos &&
      dojo.indexOf(toura.app.manifest.videos.posters || [], filename) > -1;
  }
});

