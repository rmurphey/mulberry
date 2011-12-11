dojo.provide('client.components.Notification');

mulberry.component('Notification', {
  componentTemplate : dojo.cache('client.components', 'Notification/Notification.haml'),

  init : function() {
    this.connect(this.notificationButton, 'click', '_notify');
  },

  _notify : function(e) {
    e.preventDefault();
    toura.app.PhoneGap.notification.alert('You have been notified!');
  }
});
