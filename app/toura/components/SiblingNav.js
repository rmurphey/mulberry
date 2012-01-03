dojo.provide('toura.components.SiblingNav');

dojo.require('toura._Component');

dojo.declare('toura.components.SiblingNav', toura._Component, {
  templateString : dojo.cache('toura.components', 'SiblingNav/SiblingNav.haml'),
  siblingTemplate : Haml(dojo.cache('toura.components', 'SiblingNav/Sibling.haml')),

  setupConnections : function() {
    var evt = toura.app.UI.hasTouch ? 'touchstart' : 'click';

    this.connect(this.handleNode, evt, 'toggle');
    this.connect(this.prevButton, evt, dojo.hitch(this, '_handleButton', 'prev'));
    this.connect(this.nextButton, evt, dojo.hitch(this, '_handleButton', 'next'));
    this.connect(this.siblingList, evt, '_handleLink');
  },

  toggle : function() {
    this.set('open', !this.open);
  },

  _handleButton : function(dir) {
    var node = this[ dir + 'Item' ];

    if (dir === 'prev') {
      toura.app.UI.set('navDirection', 'back');
    }

    toura.app.Router.go(node.url, true);
  },

  _handleLink : function(e) {
    var target = e.target,
        url = dojo.attr(target, 'data-href');

    if (!url) { return; }

    if (dojo.hasClass(target.parentNode, 'prev')) {
      toura.app.UI.set('navDirection', 'back');
    }

    toura.app.Router.go(url, true);
  },

  _setOpenAttr : function(open) {
    dojo[ open ? 'addClass' : 'removeClass' ](this.domNode, 'open');
    this.open = open;
  },

  _setNodeAttr : function(node) {
    if (!node || !node.siblings || !node.siblings.length) {
      this.hide();
      this.set('open', false);
      this.siblings = false;
      return;
    }

    this.show();

    this._processSiblings(node.siblings, node);
  },

  _processSiblings : function(siblings, currentItem) {
    this.siblings = siblings.length ? true : false;

    dojo.forEach(siblings, function(sibling, idx) {
      if (sibling.id === currentItem.id) {
        this.currentIndex = idx;
      }
    }, this);

    var nextIndex = this.currentIndex + 1;
    var prevIndex = this.currentIndex - 1;

    this.nextItem = nextIndex >= siblings.length ? null : siblings[nextIndex];
    this.prevItem = prevIndex < 0 ? null : siblings[prevIndex];

    this._updateButtons();
    this._updateLinks();
  },

  _updateButtons : function() {
    dojo[this.nextItem ? 'removeClass' : 'addClass'](this.nextButton, 'inactive');
    dojo[this.prevItem ? 'removeClass' : 'addClass'](this.prevButton, 'inactive');
  },

  _updateLinks : function() {
    var html, viewModel;

    dojo.empty(this.siblingList);

    if (this.prevItem) {
      viewModel = dojo.mixin(this.prevItem, { className : 'prev' });
      this.prevLink = dojo.place(this.siblingTemplate(viewModel), this.siblingList);
    }

    if (this.nextItem) {
      viewModel = dojo.mixin(this.nextItem, { className : 'next' });
      this.nextLink = dojo.place(this.siblingTemplate(viewModel), this.siblingList);
    }
  }


});
