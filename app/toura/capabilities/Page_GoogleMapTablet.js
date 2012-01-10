dojo.provide('toura.capabilities.Page_GoogleMapTablet');

dojo.require('toura._Capability');

dojo.declare('toura.capabilities.Page_GoogleMapTablet', toura._Capability, {
  requirements : {
    googleMap : 'GoogleMap',
    pinInfo : 'PinInfo'
  },

  connects : [
    [ 'googleMap', 'onShowInfo', '_showPin' ]
  ],

  init : function() {
    this.pinInfo.region.hide();
    this.googleMap.set('pinInfo', this.pinInfo);
  },

  _showPin : function(pin) {
    this.pinInfo.set('pin', pin);
  }
});
