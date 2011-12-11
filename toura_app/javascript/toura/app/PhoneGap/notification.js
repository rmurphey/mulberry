dojo.provide('toura.app.PhoneGap.notification');

toura.app.PhoneGap.notification = function(pg, device) {
  return {
    alert : function(msg) {
      if (pg) {
        navigator.notification.alert(msg);
      } else {
        alert(msg);
      }
    }
  };
};
