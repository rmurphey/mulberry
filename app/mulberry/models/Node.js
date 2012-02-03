dojo.provide('mulberry.models.Node');

dojo.require('mulberry.Device');
dojo.require('mulberry.models.SimpleNode');
dojo.require('mulberry.app.URL');
dojo.require('mulberry.models.Image');
dojo.require('mulberry.models.HeaderImage');
dojo.require('mulberry.models.BackgroundImage');
dojo.require('mulberry.models.FeaturedImage');
dojo.require('mulberry.models.Video');
dojo.require('mulberry.models.Audio');
dojo.require('mulberry.models.Data');
dojo.require('mulberry.models.TextAsset');
dojo.require('mulberry.models.GoogleMapPin');
dojo.require('mulberry.models.Feed');

(function(){

var cache = {};

dojo.subscribe('/tour/update', function() { cache = {}; });

dojo.declare('mulberry.models.Node', [], {
  /*
   * convert a node store item into a plain
   * javascript object that can be consumed
   * by a view
   */
  constructor : function(store, item) {
    var id = store.getValue(item, 'id'),
        device = mulberry.Device;

    if (cache[id]) {
      dojo.mixin(this, cache[id]);
      return;
    }

    this.store = store;
    this._dataCache = {};

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
        phone : getAssets('phoneHeaderImage', mulberry.models.HeaderImage)[0],
        tablet : getAssets('tabletHeaderImage', mulberry.models.HeaderImage)[0]
      },

      backgroundImage : {
        phone : getAssets('phoneBackgroundImage', mulberry.models.BackgroundImage)[0],
        tablet : getAssets('tabletBackgroundImage', mulberry.models.BackgroundImage)[0]
      },

      featuredImage : getAssets('featuredImage', mulberry.models.FeaturedImage)[0],

      children : store.getValues(item, 'children'),
      bodyText : store.getValue(item, 'bodyText'),

      images : getAssets('images', mulberry.models.Image),
      audios : getAssets('audios', mulberry.models.Audio),
      videos : getAssets('videos', mulberry.models.Video),

      data : getAssets('dataAssets', mulberry.models.Data),

      staticMapImages : getAssets('imageMapImages', mulberry.models.Image),

      googleMapPins : getAssets('googleMapPins', mulberry.models.GoogleMapPin),

      feeds : getAssets('feeds', mulberry.models.Feed),

      pageDef : store.getValue(item, 'pageController'),
      sharingURL : store.getValue(item, 'sharingUrl'),

      parent : store.getValue(item, 'parent')
    });

    dojo.mixin(this, {
      url : mulberry.app.URL.node(this.id),
      bodyText : this.bodyText && new mulberry.models.TextAsset(store, this.bodyText),
      assetTypeUrl : function(type) {
        return this.url + '/' + type;
      },
      parent : this.parent && new mulberry.models.Node(store, this.parent),
      isHomeNode : this.id === mulberry.app.Config.get("app").homeNodeId
    });

    this.pageDef = dojo.isObject(this.pageDef) ? this.pageDef[device.type] : this.pageDef;

    if (!this.pageDef) {
      this.pageDef = 'default';
    }

    this.siblings = this.parent ? dojo.map(this.parent.children, function(c) {
      return new mulberry.models.SimpleNode(this.store, c);
    }, this) : [];

    this._assetCache = {};

    dojo.forIn(store.getValue(item, 'custom'), function(k, v) {
      this[k] = this[k] || v;
    }, this);

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
      console.warn('mulberry.models.Node::_pluralize(): no property found for', type);
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
        console.warn('mulberry.models.Node::getAssetById(): No matching asset property found for', type);
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
      return new mulberry.models.Node(this.store, c);
    }, this);
    this.childrenPopulated = true;
  },

  getData : function(type) {
    if (!this._dataCache[type]) {
      var matches = dojo.filter(this.data, function(d) {
        return d.type === type;
      });

      this._dataCache[type] = !matches.length ? false : matches[0].json;
    }

    return this._dataCache[type];
  }
});

}());
