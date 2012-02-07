dojo.provide('toura.components.AdTag');

dojo.require('toura._Component');

dojo.declare('toura.components.AdTag', toura._Component, {
  templateString : dojo.cache('toura.components', 'AdTag/AdTag.haml'),

  adjustMarkup : function() {
    var src = dojo.string.substitute("http://${host}/${os}/${device}/media/html/ad-${device}.html",
      {
        host   : window.location.host,
        os     : this.device.os,
        device : this.device.type
      });

    dojo.attr(this.adFrame,"src",src);
  }
});
