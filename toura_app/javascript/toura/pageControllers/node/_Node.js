dojo.provide('toura.pageControllers.node._Node');

dojo.require('toura.pageControllers._Page');
dojo.require('toura.components.PageNav');

dojo.declare('toura.pageControllers.node._Node', [ toura.pageControllers._Page ], {
  templateString : '%div',
  shareable : true,

  postMixInProperties : function() {
    this.inherited(arguments);

    if (!this.node) {
      this.node = this.baseObj;
    }

    this.node.shareable = this.shareable;
  },

  postCreate : function() {
    this.inherited(arguments);

    if (this.baseObj && this.baseObj.id) {
      this.addClass('page-' + this.baseObj.id);
    }
  },

  _getDimensions : function() {
    return toura.app.UI.viewport;
  },

  // @override
  _getBackgroundImage : function() {
    if (!this.node.backgroundImage) { return; }

    var img = this.node.backgroundImage[this.device.type];

    if (img) {
      return this.device.type === 'phone' ? img.gallery : img.original;
    }

    return this.inherited(arguments);
  },

  setupNav : function() {
    this.inherited(arguments);

    if (!this.pageNav) { return; }

    // don't create page nav on home node pages
    if (this.node.id === toura.app.Config.get('app').homeNodeId) {
      dojo.destroy(this.pageNav);
      return;
    }

    this.adopt(toura.components.PageNav, {
      shareable : this.shareable,
      node : this.node
    }).placeAt(this.pageNav, 'replace');
  }
});
