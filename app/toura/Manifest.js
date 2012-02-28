dojo.provide('toura.Manifest');

dojo.require('dojo.io.script');

dojo.declare('toura.Manifest', null, {
  url : './media/manifest.js',

  constructor :  function() {
    dojo.when(this._load(), dojo.hitch(this, '_parse'));
  },

  _load : function() {
    if (toura.forceStreaming) { return; }
    return this.manifest || dojo.io.script.get({ url : this.url });
  },

  _parse : function() {
    if (!toura.manifest) {
      toura.manifest = {};
      return;
    }

    var manifest = {};
    this._parseDir(manifest, toura.manifest.dirs);
    toura.manifest = manifest;
  },

  _parseDir : function(base, obj) {
    dojo.forIn(obj, function(dirname, contents) {
      base[dirname] = contents.files ? contents.files : [];

      if (contents.dirs) {
        dojo.forIn(contents.dirs, function(subdirname, contents) {
          this._parseDir(base[dirname], contents);
        }, this);
      }

    }, this);
  }
});

dojo.subscribe('/app/deviceready', function() {
  toura.Manifest = new toura.Manifest();
});
