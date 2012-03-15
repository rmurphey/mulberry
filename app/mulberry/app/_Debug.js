dojo.provide('mulberry.app._Debug');

dojo.require('dojo.cookie');
dojo.require('mulberry._Component');
dojo.require('mulberry.app.DeviceStorage');

(function(){

var weinreServer = 'http://api.toura.com/weinre/',

    sub = dojo.subscribe('/debug/user', function(query) {
      if (!confirm('Click OK if you want to enter debug mode.')) { return; }

      mulberry.app.Router.go('/debug/' + query);
    });

var createHash = function() {
  var nonce = [],
      length = 2; // arbitrary - looks like a good length

  while (length--) {
    nonce.push((((1+Math.random())*0x10000)).toString(16).substring(0,3));
  }

  return '#m-' + nonce.join("");
};


mulberry.app._Debug = function(el) {
  var tools = new mulberry.app._Debug.Tools().placeAt(el, 'first'),
      msg = new mulberry.app._Debug.Message().placeAt(el, 'first'),
      tpl = 'Debug &#64; {url} code: {hash}'.replace('{url}', weinreServer);

  dojo.connect(tools, 'onWeinre', function(hash) {
    msg.set('content', tpl.replace('{hash}', hash.slice(1)));
  });
};

mulberry.app._Debug.weinre = {
  init : function() {
    var cookie = dojo.cookie('debug-hash'),
        hash = cookie || createHash(),
        s = document.createElement('script'),
        url = s.src = this.script + hash;

    if (this.enabled) { return hash; }

    window.WeinreServerURL = weinreServer;

    document.body.appendChild(s);
    dojo.cookie('debug-hash', hash);
    this.enabled = true;

    return hash;
  },

  script : weinreServer + 'target/target-script-min.js',
  client : function(hash) {
    return weinreServer + 'client/{hash}'.replace('{hash}', hash);
  }
};

dojo.declare('mulberry.app._Debug.Tools', mulberry._Component, {
  templateString : '<div class="component debug-tools"><div class="buttons"></div></div>',

  actions : [
    {
      name : 'Reset DB',
      method : '_resetDB'
    },
    {
      name : 'weinre',
      method : '_weinre'
    }
  ],

  postCreate : function() {
    this.inherited(arguments);
    this._makeActions();
  },

  _makeActions : function() {
    dojo.forEach(this.actions, function(action) {
      var n = dojo.create('div', {
        className : 'button',
        innerHTML : action.name
      });

      dojo.place(n, this.domNode.firstChild);

      this.connect(n, 'click', action.method);
    }, this);
  },

  _resetDB : function() {
    mulberry.app.DeviceStorage.drop();
    window.location.reload();
  },

  _weinre : function() {
    if (this.hasWeinre) { return; }

    var hash = mulberry.app._Debug.weinre.init();
    this.hasWeinre = true;
    this.onWeinre(hash);
  },

  onWeinre : function(hash) { }
});

dojo.declare('mulberry.app._Debug.Message', mulberry._Component, {
  templateString : '<div class="component debug-message"></div>',

  postCreate : function() {
    this.inherited(arguments);
    var n = dojo.create('div', {
      className : 'close',
      innerHTML : 'close'
    });

    dojo.place(n, this.domNode);
    this.connect(n, 'click', function() { this.hide(); });

    this.msgNode = dojo.create('div');
    dojo.place(this.msgNode, this.domNode);

    this.hide();
  },

  _setContentAttr : function(msg) {
    this.show();
    this.msgNode.innerHTML = msg;
  }
});

}());
