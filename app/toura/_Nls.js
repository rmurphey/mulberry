dojo.provide('toura._Nls');

dojo.require('dojo.i18n');
dojo.require('dojo.string');
dojo.requireLocalization('toura', 'toura');

dojo.declare('toura._Nls', null, {
  /* http://www.ibm.com/developerworks/web/library/wa-dojo/ */
  data: {
    __initialized : false
  },

  constructor : function() {
    if (!this.data.__initialized) {
      this.data.nlsStrings = dojo.i18n.getLocalization("toura", "toura", toura.app.Config.get("locale"));
      this.data.__initialized = true;
    }
  },

  /**
  *
  * @param {String} key - the name of the key in the translation file
  * @param {Object or Array?} substitutes - in cases where the translated  
  *   string is a template for string substitution, this parameter
  *   holds the values to be used by dojo.string.substitute on that  
  *   template
  */
  getString : function(/*String*/ key, /*Object or Array?*/ substitutes) {
    var str = this.data.nlsStrings[key];
    return (substitutes) ? dojo.string.substitute(str,substitutes) : str;
  },

  postMixInProperties : function() {
    this.inherited('postMixInProperties', arguments);
    this.initializeStrings();
  },

  initializeStrings : function(){
    // stub for subclasses
  }
});
