dojo.provide('mulberry.capabilities.Page_GoogleMapTablet');

dojo.require('mulberry._Capability');

dojo.declare('mulberry.capabilities.Page_GoogleMapTablet', mulberry._Capability, {
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
