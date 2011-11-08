dojo.provide('toura.app.Phonegap.notification');

toura.app.Phonegap.notification = function(pg, device) {
  return {
    alert : function(msg) {
      if (pg) {
        navigator.notification.alert(msg);
      } else {
        alert(msg);
      }
    }
  }
};
