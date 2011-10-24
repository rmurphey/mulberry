dojo.provide('client.components.Login');

mulberry.component('Login', {
  componentTemplate : dojo.cache('client.components', 'Login/Login.haml'),

  init : function() {
    this.connect(this.domNode, 'submit', '_onSubmit');
  },

  _onSubmit : function(e) {
    e.preventDefault();

    var d = dojo.formToObject(this.domNode),
        msg;

    if (!this._validate(d)) {
      msg = "You must enter a username."

      if (toura.app.Phonegap.present) {
        navigator.notification.alert(msg);
      } else {
        alert(msg);
      }

      return;
    }

    toura.app.DeviceStorage.set('username', d.username);
    toura.app.Router.go('/animals');
  },

  _validate : function(d) {
    return !!dojo.trim(d.username);
  }
});
