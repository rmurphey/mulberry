dojo.provide('toura.app.Manifest');

dojo.require('dojo.io.script');

dojo.declare('toura.app.Manifest', [], {
  url : './media/manifest.js',

  constructor :  function() {
    dojo.when(this._load(), dojo.hitch(this, '_parse'));
  },

  _load : function() {
    return this.manifest || dojo.io.script.get({ url : this.url });
  },

  _parse : function() {
    if (!toura.app.manifest) {
      toura.app.manifest = {};
      return;
    }

    var manifest = {};
    this._parseDir(manifest, toura.app.manifest.dirs);
    toura.app.manifest = manifest;
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
  toura.app.Manifest = new toura.app.Manifest();
});
