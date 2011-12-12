dojo.provide('client.components.Accelerometer');

mulberry.component('Accelerometer', {
  componentTemplate : dojo.cache('client.components', 'Accelerometer/Accelerometer.haml'),

  init : function() {
    this.connect(this.accelButton, 'click', '_getAccel');
  },

  _getAccel : function() {
    toura.app.PhoneGap.accelerometer.getCurrentAcceleration()
      .then(dojo.hitch(this, '_showAccel'));
  },

  _showAccel : function(accel) {
    var str = '';

    dojo.forIn(accel, function(k, v) {
      str += '<li>' + k + ': ' + v + '</li>';
    });

    this.accel.innerHTML = str;
    dojo.publish('/content/update'); // update the scroller dimensions
  }
});
