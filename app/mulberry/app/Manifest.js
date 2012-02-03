dojo.provide('mulberry.app.Manifest');

dojo.require('dojo.io.script');

dojo.declare('mulberry.app.Manifest', [], {
  url : './media/manifest.js',

  constructor :  function() {
    dojo.when(this._load(), dojo.hitch(this, '_parse'));
  },

  _load : function() {
    return this.manifest || dojo.io.script.get({ url : this.url });
  },

  _parse : function() {
    if (!mulberry.app.manifest) {
      mulberry.app.manifest = {};
      return;
    }

    var manifest = {};
    this._parseDir(manifest, mulberry.app.manifest.dirs);
    mulberry.app.manifest = manifest;
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
  mulberry.app.Manifest = new mulberry.app.Manifest();
});
