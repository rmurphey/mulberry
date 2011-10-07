dojo.provide('toura.ui.Clickable');

/**
 * This is intended for internal use only by toura._View
 */
dojo.declare('toura.ui.Clickable', null, {
  constructor : function(el, handler) {
    this.connections = [];
    this.secondaryConnections = [];
    this.subscriptions = [];
    this.handler = handler;
    this.el = el;
    this.moved = false;

    dojo.addClass(this.el, 'not-moving');

    if (toura.app.UI.hasTouch) {
      this.connections.push(dojo.connect(el, 'touchstart', this, '_onTouchStart'));
      this.connections.push(dojo.connect(el, 'click', function(e) {
        e.preventDefault();
      }));
    } else {
      this.connections.push(dojo.connect(el, 'click', this, '_handle'));
    }
  },

  _onTouchStart : function() {
    this.touchStartTime = new Date().getTime();

    this.secondaryConnections = [
      dojo.connect(this.el, 'touchmove', this, '_onTouchMove'),
      dojo.connect(this.el, 'touchend', this, '_handle')
    ];
  },

  _onTouchMove : function() {
    dojo.removeClass(this.el, 'not-moving');
    this.moved = true;
  },

  _handle: function(e) {
    this.touchEndTime = new Date().getTime();

    dojo.addClass(this.el, 'not-moving');

    dojo.forEach(this.secondaryConnections || [], dojo.disconnect);
    this.secondaryConnections = [];

    if (toura.animating) {
      e.preventDefault();
      console.log('click ignored during animation');
      return;
    }

    var trueTarget = e.target,
        href = dojo.attr(trueTarget, 'href');

    if (this.touchStartTime && (this.touchEndTime - this.touchStartTime > toura.app.UI.touchMoveDebounce) && this.moved) {
      this.moved = false;
      return;
    }

    while (!href && trueTarget !== this.el) {
      href = dojo.attr(trueTarget, 'href');
      if (!href) { trueTarget = trueTarget.parentNode; }
    }

    if (!href) { return; }

    // run the handler function
    if (this.handler && dojo.isFunction(this.handler) && this.handler(trueTarget, e) === false) {
      return;
    }

    // we only get to here if the handler function did not return false;
    // this is the default behavior we're going to want most of the time
    if (!/#/.test(href)) {
      return;
    }

    href = href.split('#')[1];

    if (href) {
      e.preventDefault();
      e.stopPropagation();
      toura.app.Router.go(href);
    }
  },

  destroy : function() {
    dojo.forEach(this.connections || [], dojo.disconnect);
    dojo.forEach(this.secondaryConnections || [], dojo.disconnect);
    dojo.forEach(this.subscriptions || [], dojo.unsubscribe);
  }
});
