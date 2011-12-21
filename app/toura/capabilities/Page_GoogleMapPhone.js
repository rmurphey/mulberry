dojo.provide('toura.capabilities.Page_GoogleMapPhone');

dojo.require('toura._Capability');

dojo.declare('toura.capabilities.Page_GoogleMapPhone', [ toura._Capability ], {
  requirements : {
    googleMap : 'GoogleMap',
    pinInfo : 'PinInfo',
    detailTitle : 'DetailTitle'
  },

  connects : [
    [ 'googleMap', 'onShowInfo', '_showPin' ],
    [ 'detailTitle', 'onClose', '_hidePin' ]
  ],

  init : function() {
    this.googleMap.set('pinInfo', this.pinInfo);
  },

  _showPin : function(pin) {
    this.page.showScreen('detail');
    this.pinInfo.set('pin', pin);
    this.detailTitle.set('screenTitle', pin.name);
  },

  _hidePin : function() {
    this.page.showScreen('index');
  }
});
