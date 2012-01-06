dojo.provide('toura._Component');

dojo.require('toura._View');
dojo.require('toura.Utilities');

dojo.declare('toura._Component', [ toura._View ], {
  handleClicks : false,

  /**
   * This is a stub for implementation by components that inherit from
   * _Component.
   *
   * This will run prior to the template being rendered; if there's any data
   * you need to massage before rendering the template, this is the place to do
   * it.
   */
  prepareData : function() { },

  /**
   * This is a stub for implementation by components that inherit from
   * _Component.
   *
   * This will run after the DOM for the component has been created, but before
   * it is visible in the page. This is where you should do any connections
   * required by the component.
   */
  setupConnections : function() { },

  /**
   * This is a stub for implementation by components that inherit from
   * _Component.
   *
   * This will run after the DOM for the component has been created, but before
   * it is visible in the page. This is where you should do any subscriptions
   * that are required by the component.
   */
  setupSubscriptions : function() { },

  /**
   * This is a stub for implementation by components that inherit from
   * _Component.
   *
   * This will run after the DOM for the component has been created, but before
   * it is visible in the page. If there are components that you want to place
   * or remove conditionally, this is the place to do it.
   */
  setupChildComponents : function() { },

  /**
   * This is a stub for implementation by components that inherit from
   * _Component.
   *
   * This will run after the DOM for the component has been created, but before
   * it is visible on the page. If you want to conditionally change markup,
   * such as adding a class, this is the place to do it.
   */
  adjustMarkup : function() { },

  /**
   * This is a stub for implementation by components that inherit from
   * _Component.
   *
   * This will run after the DOM for the component has been created and placed
   * in the page, and the component is visible in the page.
   */
  resizeElements : function() { },

  /**
   * This is a stub for implementation by components that inherit from
   * _Component.
   *
   * This will run right before the component is destroyed. Use this method to
   * clean up any items that may continue to occupy memory after the component
   * is destroyed. Note that you do not need to clean up after connections and
   * subscriptions that were created with this.connect or this.subscribe.
   */
  teardown : function() { },

  /**
   * @param templateFn A template function that will receive a data item and return
   * a string
   * @param data An array of data items to be processed by the template
   * function
   */
  populate : function(templateFn, data) {
    this.populateElement(this.domNode, templateFn, data);
  },

  /**
   * @param element A node to be populated with HTML based on the provided data
   * @param templateFn A template function that will receive a data item and return
   * a string
   * @param data An array of data items, or single data item, to be processed by the template
   * function
   */
  populateElement : function(element, templateFn, data) {
    if (dojo.isString(element)) {
      element = this[element];
    }

    if (!element) { return; }

    element.innerHTML = dojo.isArray(data) ? dojo.map(data, templateFn).join('') : templateFn(data);

    if (this.region) {
      this.region.refreshScroller();
    }
  },

  postMixInProperties : function() {
    this.inherited(arguments);

    if (this.screen) {
      this.screen.registerComponent(this);
      this.connect(this.screen, 'startup', 'startup');
    }

    this.prepareData();
    this._loadHelpers();

    this.inherited(arguments);
  },

  postCreate : function() {
    this.inherited(arguments);

    if (this.isHidden) {
      this.hide();
    }

    if (this.handleClicks) {
      this.preventClickDelay(
        this.clickableNode || this.domNode,
        this._clickHandler && dojo.hitch(this, '_clickHandler')
      );
    }

    this.subscribe('/window/resize', function() {
      this.dimensions = null;
    });

    this.setupChildComponents();
    this.adjustMarkup();
    this.setupConnections();
    this.setupSubscriptions();
  },

  startup : function() {
    this.inherited(arguments);
    this.resizeElements();

    if (this.when) {
      dojo.forIn(this.when, function(k, v) {
        var node = this.node || this.baseObj;
        node[k].then(dojo.hitch(this, v));
      }, this);
    }
  },

  destroy : function() {
    this.teardown();
    this.inherited(arguments);
  },

  _loadHelpers : function() {
    if (this.helpers && dojo.isObject(this.helpers)) {
      dojo.forIn(this.helpers, function(prop, tpl) {
        if (tpl) {
          this.helpers[prop] = Haml(tpl)();
        }
      }, this);
    }
  },

  _setupTouch : function(ele, handler) {
    var touch = toura.app.UI.hasTouch,
        evt = touch ? 'touchstart' : 'click';

    this.connect(ele, evt, handler);
    if (touch) { this.connect(ele, 'click', function(e) { e.preventDefault(); }); }
  },

  getDimensions : function() {
    var domNode = this[this.sizeNode];

    this.dimensions = this.dimensions || {
      width : dojo.style(this.domNode, 'width'),
      height : dojo.style(this.domNode, 'height')
    };

    return this.dimensions;
  }

});

toura.component = function(name, proto) {
  var p = dojo.mixin(proto, {
    templateString : proto.componentTemplate || '%div',

    prepareData : function() {
      this.inherited(arguments);

      if (proto.prep) {
        proto.prep.call(this);
      }
    },

    postCreate : function() {
      this.inherited(arguments);
      if (window.jQuery) { this.$domNode = jQuery(this.domNode); }
    },

    startup : function() {
      this.inherited(arguments);
      if (proto.init) {
        proto.init.call(this);
      }
    }
  });

  dojo.declare('client.components.' + name, toura._Component, p);
};
