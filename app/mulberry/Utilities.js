dojo.provide('mulberry.Utilities');

// You should have a very, very good reason to put something in this file.

dojo.forIn = function(obj, fn, scope) {
  var k;
  for (k in obj) {
    if (obj.hasOwnProperty(k)) {
      dojo.hitch(scope || window, fn)(k, obj[k]);
    }
  }
};

mulberry.util = {
  truncate : function(text, len) {
    var oldText;

    len = len || 200;

    text = text
      .replace('<\/p>',' ')
      .replace('<br>',' ')
      .replace(/(<\/.>)|(<.>)|(<[^b][^r]?[^>]*>)/g, '');

    oldText = text = dojo.trim(text);

    text = text.substr(0, len);

    if (text && oldText.length > len) {
      text = text + ' &hellip;';
    }

    return text;
  },

  copyStyles : function(fromEl, toEl, styles) {
    var fromStyles = window.getComputedStyle(fromEl);

    // TODO: Filter this, then call dojo.style once?
    dojo.forEach(styles, function(style) {
      dojo.style(toEl, style,
        fromStyles[style]
      );
    });
  }

};

mulberry.tmpl = function(str, data) {
  return dojo.string.substitute(str, data);
};

mulberry.haml = Haml;

mulberry.jsonp = function(url, config) {
  config = dojo.isObject(url) ? url : (config || {});
  config.callbackParamName = config.callback || config.callbackParamName || 'callback';
  url = dojo.isString(url) ? url : config.url;

  if (!url) { return; }

  return dojo.io.script.get(dojo.delegate(config, { url : url }));
};

mulberry.page = function(route, config, isDefault) {
  mulberry.route(route, function(params) {
    mulberry.showPage(mulberry.createPage(dojo.mixin(config, { params : params })));
  }, isDefault);
};
