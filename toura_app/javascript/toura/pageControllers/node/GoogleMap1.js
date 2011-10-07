dojo.provide('toura.pageControllers.node.GoogleMap1');

dojo.require('toura.pageControllers.node._Node');
dojo.require('toura._AsyncView');
dojo.require('toura.components.GoogleMap');
dojo.require('toura.components.PinInfo');
dojo.require('toura.app.Phonegap');

dojo.declare('toura.pageControllers.node.GoogleMap1', [ toura.pageControllers.node._Node, toura._AsyncView ], {
  templateString : dojo.cache('toura.pageControllers.node', 'GoogleMap1/GoogleMap1.haml'),

  postCreate: function () {
    toura.app.Phonegap.network.isReachable('maps.google.com')
      .then(dojo.hitch(this, '_postCreate'));

    toura.app.UI.set('siblingNavVisible', false);
    this.inherited(arguments);
  },

  _postCreate : function(reachable) {
    if (!reachable) {
      this.failure = 'No internet connection found.';
      return;
    }

    var components = toura.components;

    this.googleMap = this.adopt(components.GoogleMap, {
      node : this.node
    }).placeAt(this.body, 'replace');

    this.pinInfo = this.adopt(components.PinInfo, {});

    if (this.phone) {
      // put the pin info on the page
      this.pinInfo.placeAt(this.detail);
    } else {
      // just pass the widget to the map widget to use
      this.googleMap.set('pinInfo', this.pinInfo);
    }

    this.connect(this.googleMap, 'onShowInfo', function(pin) {
      if (this.phone) { dojo.addClass(this.detail, 'active'); }
      this.pinInfo.set('pin', pin);
    });

    this.connect(this.pinInfo, 'onClose', function() {
      if (this.phone) { dojo.removeClass(this.detail, 'active'); }
    });

    this._doQueue();
  },

  _setPin : function(pin) {
    this.googleMap.set('pin', pin);
  },

  init : function(pageState) {
    if (!pageState.assetId) { return; }

    if (!this.googleMap) {
      this._addToQueue(dojo.hitch(this, 'init', pageState));
      return;
    }

    // set the pin if one is indicated in the URL
    this._setPin(pageState.assetId);
    this.inherited(arguments);
  }
});

