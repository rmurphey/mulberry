dojo.provide('toura.app._Debug');

dojo.require('dojo.cookie');
dojo.require('toura._Component');
dojo.require('toura.app.DeviceStorage');

(function(){

var weinreServer = 'http://api.toura.com/weinre/',

    sub = dojo.subscribe('/debug/user', function(query) {
      if (!toura.features.debugPage) { return; }
      if (!confirm('Click OK if you want to enter debug mode.')) { return; }

      toura.app.Router.go('/debug/' + query);
    });

var createHash = function() {
  var nonce = [],
      length = 2; // arbitrary - looks like a good length

  while (length--) {
    nonce.push((((1+Math.random())*0x10000)).toString(16).substring(0,3));
  }

  return '#toura-' + nonce.join("");
};


toura.app._Debug = function() {
  var tools = new toura.app._Debug.Tools().placeAt(dojo.body(), 'first'),
      msg = new toura.app._Debug.Message().placeAt(dojo.body(), 'first'),
      tpl = 'Debug &#64; {url} code: {hash}';

  dojo.connect(tools, 'onWeinre', function(hash) {
    msg.set(
      'content',
      tpl.split('{url}').join(weinreServer).split('{hash}').join(hash.slice(1))
    );
  });
};

toura.app._Debug.weinre = {
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

dojo.declare('toura.app._Debug.Tools', toura._Component, {
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
    toura.app.DeviceStorage.drop();
    window.location.reload();
  },

  _weinre : function() {
    if (this.hasWeinre) { return; }

    var hash = toura.app._Debug.weinre.init();
    this.hasWeinre = true;
    this.onWeinre(hash);
  },

  onWeinre : function(hash) { }
});

dojo.declare('toura.app._Debug.Message', toura._Component, {
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
