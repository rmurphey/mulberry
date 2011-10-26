dojo.provide('toura.capabilities.Page_GoogleMapTablet');

dojo.require('toura.capabilities._Capability');

dojo.declare('toura.capabilities.Page_GoogleMapTablet', [ toura.capabilities._Capability ], {
  requirements : {
    googleMap : 'GoogleMap',
    pinInfo : 'PinInfo'
  },

  connects : [
    [ 'googleMap', 'onShowInfo', '_showPin' ]
  ],

  init : function() {
    this.googleMap.set('pinInfo', this.pinInfo);
  },

  _showPin : function(pin) {
    this.pinInfo.set('pin', pin);
  }
});
