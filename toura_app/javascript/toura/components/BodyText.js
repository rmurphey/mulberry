dojo.provide('toura.components.BodyText');

dojo.require('toura._Component');

dojo.declare('toura.components.BodyText', toura._Component, {
  templateString : dojo.cache('toura.components', 'BodyText/BodyText.haml'),

  prepareData : function() {
    this.bodyText = this.bodyText || this._getBodyText();
  },

  adjustMarkup : function() {
    if (!dojo.trim(this.bodyText)) {
      this.addClass('empty');
    }
  },

  _getBodyText : function() {
    if (!this.node) { return ''; }
    return this.node.bodyText ? this.node.bodyText.body : '';
  },

  setupConnections : function() {
    this.query('a[rel="external"]').attr('target', '_blank');
    this.connect(this.domNode, 'click', '_handleClick');
  },

  _handleClick : function(e) {
    var t = e.target,
        href,
        rel;

    if (t.nodeName.toLowerCase() !== 'a') { return; }

    rel = dojo.attr(t, 'rel');

    if (rel && rel === 'external') {
      // allow links w/rel="external" not to go to child browser
      return;
    }

    href = dojo.attr(t, 'href');

    if (/^http/.test(href)) {
      e.preventDefault();
      // show the link in child browser by default
      toura.app.PhoneGap.browser.url(href);
      return;
    }
  },

  _setContentAttr : function(val) {
    this.bodyTextContainer.innerHTML = val;
    dojo[val ? 'removeClass' : 'addClass'](this.domNode, 'empty');
  }
});
