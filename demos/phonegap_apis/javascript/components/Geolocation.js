dojo.provide('client.components.Geolocation');

mulberry.component('Geolocation', {
  componentTemplate : dojo.cache('client.components', 'Geolocation/Geolocation.haml'),

  init : function() {
    this.connect(this.locationButton, 'click', '_getLocation');
  },

  _getLocation : function(e) {
    e.preventDefault();
    toura.app.PhoneGap.geolocation.getCurrentPosition()
      .then(dojo.hitch(this, '_showLocation'));
  },

  _showLocation : function(loc) {
    var str = '';

    dojo.forIn(loc.coords, function(k, v) {
      str += '<li>' + k + ': ' + v + '</li>';
    });

    this.location.innerHTML = str;
    dojo.publish('/content/update'); // update the scroller dimensions
  }
});
