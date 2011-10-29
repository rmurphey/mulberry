dojo.provide('client.data.Twitter');

dojo.declare('client.data.Twitter', null, {
  get : function(username) {
    var url = 'http://twitter.com/status/user_timeline/${username}.json?count=10';

    return dojo.io.script.get({
      url : toura.tmpl(url, { username : username }),
      callbackParamName : 'callback'
    }).then(dojo.hitch(this, '_onLoad'));
  },

  _onLoad : function(data) {
    var latest = data[0];

    return {
      text : latest.text,
      date : dojo.date.locale.format(new Date(latest.created_at))
    }
  }
});
