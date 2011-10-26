dojo.provide('toura.capabilities.Page_GoogleMapPhone');

dojo.require('toura.capabilities._Capability');

dojo.declare('toura.capabilities.Page_GoogleMapPhone', [ toura.capabilities._Capability ], {
  requirements : {
    googleMap : 'GoogleMap',
    pinInfo : 'PinInfo'
  },

  connects : [
    [ 'googleMap', 'onShowInfo', '_showPin' ],
    [ 'pinInfo', 'onClose', '_hidePin' ]
  ],

  init : function() {
    this.googleMap.set('pinInfo', this.pinInfo);
  },

  _showPin : function(pin) {
    this.page.showScreen('detail');
    this.pinInfo.set('pin', pin);
  },

  _hidePin : function() {
    this.page.showScreen('index');
  }
});
