dojo.provide('toura.app.Notifications');

(function() {

var notificationCallback;

toura.app.Notifications = {
  areAvailable: function() {
    return !!toura.app.PhoneGap.present;
  },

  init: function() {
    if (!toura.app.PhoneGap.present) { return; }

    window.plugins.pushNotification.startNotify();
    this._apnRegister();
  },

  setNotificationCallback: function(callback) {
    if (!toura.app.PhoneGap.present) { return; }

    notificationCallback = window.plugins.pushNotification.notificationCallback = callback;
  },

  notify: function(notification) {
    notificationCallback(notification);
  },

  // register with APN
  _apnRegister: function() {
    window.plugins.pushNotification.register(
      function(e) { toura.app.Notifications._apnOnRegisterSuccess(e); },
      function(e) { toura.app.Notifications._apnOnRegisterError(e); },
      [{ alert:true, badge:true, sound:true }]);
    console.log('APN push notification registered.');
  },

  _apnOnRegisterSuccess: function(e) {
    this._urbanAirshipRegister(e.deviceToken, e.host, e.appKey, e.appSecret);
  },

  _apnOnRegisterError: function(e) {
    console.log('error registering with APN: ' + e.toString());
  },

  // register urban airship push service after APN is registered successfully
  _urbanAirshipRegister: function(deviceToken, host, appKey, appSecret) {
    // TODO: use dojo.xhrPut?
    var request = new XMLHttpRequest();

    // open the client and encode our URL
    request.open('PUT', host + 'api/device_tokens/' + deviceToken, true, appKey, appSecret);

    // callback when request finished
    request.onload = function() {
      if(this.status === 200 || this.status === 201) {
        // register UA push success
        console.log('Successfully registered with Urban Airship.');
      } else {
        // error
        console.log('Error when registring with Urban Airship: '+this.statusText);
      }
    };

    request.send();
  }
};

var Notifications = toura.app.Notifications;

dojo.subscribe('/app/ready', function() {
  var alertCallback = function(){},
      alertTitle = "Notification from " + toura.app.Config.get('app').name;

  Notifications.init();

  Notifications.setNotificationCallback(
    function(notification) {
      window.navigator.notification.alert(notification.alert, alertCallback, alertTitle);
    }
  );
});

}());
