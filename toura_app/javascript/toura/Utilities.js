dojo.provide('toura.Utilities');

// You should have a very, very good reason to put something in this file.

dojo.forIn = function(obj, fn, scope) {
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      dojo.hitch(scope || window, fn)(k, obj[k]);
    }
  }
};

toura.util = {
  truncate : function(text, len) {
    var oldText;

    len = len || 200;

    text = text
      .replace('<\/p>',' ')
      .replace('<br>',' ')
      .replace(toura.regex.stripHTML, '');

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

toura.regex = {
  stripHTML : /(<\/.>)|(<.>)|(<[^b][^r]?[^>]*>)/g
};

toura.tmpl = function(str, data) {
  return dojo.string.substitute(str, data);
};

toura.haml = Haml;

toura.publish = dojo.hitch(dojo, 'publish');
toura.subscribe = dojo.hitch(dojo, 'subscribe');

