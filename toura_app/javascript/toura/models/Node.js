dojo.provide('toura.models.Node');

dojo.require('toura.models.SimpleNode');
dojo.require('toura.app.URL');
dojo.require('toura.models.Image');
dojo.require('toura.models.HeaderImage');
dojo.require('toura.models.BackgroundImage');
dojo.require('toura.models.FeaturedImage');
dojo.require('toura.models.Video');
dojo.require('toura.models.Audio');
dojo.require('toura.models.Data');
dojo.require('toura.models.TextAsset');
dojo.require('toura.models.GoogleMapPin');
dojo.require('toura.models.Feed');

(function(){

var cache = {};

dojo.subscribe('/tour/update', function() { cache = {}; });

dojo.declare('toura.models.Node', [], {
  /*
   * convert a node store item into a plain
   * javascript object that can be consumed
   * by a view
   */
  constructor : function(store, item) {
    var id = store.getValue(item, 'id');

    if (cache[id]) {
      dojo.mixin(this, cache[id]);
      return;
    }

    this.store = store;

    var getAssets = function(assetKey, Model) {
      return dojo.map(
        store.getValues(item, assetKey) || [],
        function(asset) { return new Model(store, asset); }
      );
    };

    dojo.mixin(this, {
      type : 'node',
      id : id,
      name : store.getValue(item, 'name'),

      headerImage : {
        phone : getAssets('phone_header_image', toura.models.HeaderImage)[0],
        tablet : getAssets('tablet_header_image', toura.models.HeaderImage)[0]
      },

      backgroundImage : {
        phone : getAssets('phone_background_image', toura.models.BackgroundImage)[0],
        tablet : getAssets('tablet_background_image', toura.models.BackgroundImage)[0]
      },

      featuredImage : getAssets('featured_image', toura.models.FeaturedImage)[0],

      children : store.getValues(item, 'children'),
      bodyText : store.getValue(item, 'body_text'),

      images : getAssets('images', toura.models.Image),
      audios : getAssets('audios', toura.models.Audio),
      videos : getAssets('videos', toura.models.Video),

      data : getAssets('data_assets', toura.models.Data),

      staticMapImages : getAssets('image_map_images', toura.models.Image),

      googleMapPins : getAssets('google_map_pins', toura.models.GoogleMapPin),

      feeds : getAssets('feeds', toura.models.Feed),

      pageController : store.getValue(item, 'page_controller'),
      sharingURL : store.getValue(item, 'sharing_url'),

      parent : store.getValue(item, 'parent')
    });

    dojo.mixin(this, {
      url : toura.app.URL.node(this.id),
      bodyText : this.bodyText && new toura.models.TextAsset(store, this.bodyText),
      assetTypeUrl : function(type) {
        return this.url + '/' + type;
      },
      parent : this.parent && new toura.models.Node(store, this.parent),
      isHomeNode : this.id === toura.app.Config.get("app").homeNodeId
    });

    this.siblings = this.parent ? dojo.map(this.parent.children, function(c) {
      return new toura.models.SimpleNode(this.store, c);
    }, this) : [];

    this._assetCache = {};

    cache[id] = this;
  },

  _pluralize : function(type) {
    var lookup = {
      'google-map-pin' : 'googleMapPins',
      'image' : 'images',
      'video' : 'videos',
      'audio' : 'audios',
      'static-map-image' : 'staticMapImages'
    };

    if (!lookup[type]) {
      console.warn('toura.models.Node::_pluralize(): no property found for', type);
    }

    return lookup[type] || (type + 's');
  },

  getAssetById : function(type, id) {
    var key = type + id,
        matches,
        assets;

    if (!this._assetCache[key]) {
      assets = this[this._pluralize(type)];

      if (!assets) {
        console.warn('toura.models.Node::getAssetById(): No matching asset property found for', type);
        assets = [];
      }

      matches = dojo.filter(assets, function(a) {
        return a.id === id;
      });

      this._assetCache[key] = matches.length ? matches[0] : false;
    }

    return this._assetCache[key];
  },

  getBackgroundImage : function(device) {
    var imageStyle = device.type === 'phone' ? 'gallery' : 'original';

    if (this.backgroundImage && this.backgroundImage[device.type]) {
      return this.backgroundImage[device.type][imageStyle];
    }

    return false;
  },

  populateChildren : function() {
    if (this.childrenPopulated) { return; }
    this.children = dojo.map(this.children, function(c) {
      return new toura.models.Node(this.store, c);
    }, this);
    this.childrenPopulated = true;
  }
});

}());
