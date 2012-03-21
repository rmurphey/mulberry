dojo.provide('toura.Manifest');

dojo.require('dojo.io.script');

dojo.declare('toura.Manifest', null, {
  constructor :  function() {
    dojo.when(this._load(), dojo.hitch(this, '_parse'));
  },

  _load : function() {
    if (toura.forceStreaming) { return; }
    return toura.manifest;
  },

  _parse : function() {
    var manifest = {};
    toura.manifest = toura.manifest || {};
    this._parseDir(manifest, toura.manifest.dirs || {});
    this.manifest = toura.manifest = manifest;
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
