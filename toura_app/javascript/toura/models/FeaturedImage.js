dojo.provide('toura.models.FeaturedImage');

dojo.require('toura.models._StorableAsset');

dojo.declare('toura.models.FeaturedImage', [ toura.models._StorableAsset ], {
  constructor :  function(store, item) {
    store.fetchItemByIdentity({
      identity : item._reference || item.image._reference,
      onItem : function(item) {
        this._getUrl(store, item);
      },
      scope : this
    });
    this.small = this.featuredSmall;
    this.large = this.featured;
    delete this.featured_small;
    delete this.featured;
    delete this.gallery;
    delete this.original;
  }
});
