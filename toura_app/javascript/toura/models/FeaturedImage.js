dojo.provide('toura.models.FeaturedImage');

dojo.require('toura.models._StorableAsset');

dojo.declare('toura.models.FeaturedImage', [ toura.models._StorableAsset ], {
  constructor :  function(store, item) {
    if (item.image) {
      store.fetchItemByIdentity({
        identity : item.image._reference,
        onItem : function(fetched) {
          item = fetched;
        }
      });
    }
 
    this._getUrl(store, item);

    this.small = this.featuredSmall;
    this.large = this.featured;
    delete this.featured_small;
    delete this.featured;
    delete this.gallery;
    delete this.original;
  }
});
