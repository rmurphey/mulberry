dojo.provide('toura.app.Local');

dojo.require('dojo.io.script');
dojo.require('toura.app.PhoneGap');

toura = toura || {};
toura.data = toura.data || {};

toura.app.Local = (function() {
  return {
    manifest : function() {
      return dojo.io.script.get({ url : './media/manifest.js', preventCache : true });
    },

    templates : function() {
      return dojo.io.script.get({ url : './data/templates.js', preventCache : true });
    }
  };
}());
