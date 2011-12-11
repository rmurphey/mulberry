dojo.provide('toura.app.PhoneGap.notification');

toura.app.PhoneGap.registerAPI('notification', function(pg, device) {
  return {
    alert : function(msg) {
      if (pg) {
        navigator.notification.alert(msg);
      } else {
        alert(msg);
      }
    }
  };
});
