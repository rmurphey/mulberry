dojo.provide('toura.components.AssetList');

dojo.require('toura._Component');

dojo.declare('toura.components.AssetList', toura._Component, {
  templateString : dojo.cache('toura.components', 'AssetList/AssetList.haml'),
  "class" : 'assets',

  prepareData : function() {
    this.assets = this.assets || (this.type && this.node[this.type]) || [];

    this.assets = dojo.map(this.assets, function(a) {
      return dojo.mixin(a, { assetUrl : this.baseUrl + '/' + a.id });
    }, this);

    this.baseUrl = this.node.assetTypeUrl(this.type);
  },

  setupConnections : function() {
    this.connect(this.domNode, 'touchmove', function() {
      this.handle = null;
    });

    this.connect(this.domNode, 'touchend', function() {
      if (this.handle && dojo.isFunction(this.handle)) {
        this.handle();
      }
    });

    dojo.forEach(this.list.children, function(n) {
      var assetId = dojo.attr(n, 'data-id');

      if (toura.app.UI.hasTouch) {
        this.connect(n, 'touchstart', function() {
          this.handle = dojo.hitch(this, '_onSelect', assetId);
        });

        this.connect(n, 'click', function(e) {
          e.preventDefault();
        });
      } else {
        this.connect(n, 'click', function(e) {
          e.preventDefault();
          this._onSelect(assetId);
        });
      }
    }, this);
  },

  _onSelect : function(assetId) {
    this.set('currentAsset', assetId);
    this.onSelect(assetId);
  },

  onSelect : function(assetId) {
    // stub for connections
  },

  _setCurrentAssetAttr : function(assetId) {
    var item = this.query('#asset-' + assetId)[0];
    this.query('.asset-list li').removeClass('current');
    dojo.addClass(item, 'current');
    this.currentAsset = assetId;
  }
});
