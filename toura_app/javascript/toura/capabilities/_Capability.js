dojo.provide('toura.capabilities._Capability');

/**
 * @class
 */
dojo.declare('toura.capabilities._Capability', [ ], {
  /**
   * An object defining the required components for the capability. The
   * object's keys are the property names that will be used to refer to the
   * component; the corresponding value is the name of the component that is
   * required.
   *
   * @example
   * For example:
   *
   *   {
   *     'imageGallery' : 'ImageGallery'
   *   }
   */
  requirements : {},

  /**
   * An array containing zero or more arrays specifying the connections that
   * the capability should set up.
   *
   * @example
   * For example:
   *
   *   [
   *     [ 'imageGallery', 'onScrollEnd', '_setCaption ]
   *   ]
   *
   * The first item in the array refers to the property name that was defined
   * in the requirements object for the component we want to listen to.
   *
   * The second item in the array is the method or event that we want to listen
   * to on the component.
   *
   * The third item in the array is the capability method that we want to run
   * when the event/method occurs.
   */
  connects : [],

  /**
   * @param {Object} config
   * - page: the page that the capability is associated with
   * - components: the components that are involved, specified as
   *   <screenName>:<componentName>
   */
  constructor : function(config) {
    dojo.mixin(this, config);

    this.domNode = this.page.domNode;
    this.node = this.page.node;

    this.involved = this._loadInvolvedComponents();

    if (!this._checkRequirements()) {
      console.error('Did not find required components for capability', this.declaredClass);
      return;
    }

    this._doLookups();
    this._doConnects();

    this.init();
  },

  /**
   * @public
   * This method can be implemented by individual capabilities, and will be run
   * once all capability setup is complete.
   */
  init : function() {
    // stub for implementation
  },

  /**
   * @private
   * Iterates over the components array provided in the config and populates
   * the `this.involved` object with references to the components.
   *
   * @returns {Object} An object where the property names are the name of the
   * component, and the values are the component associated with that name.
   */
  _loadInvolvedComponents : function() {
    var involved = {};

    dojo.forEach(this.components, function(c) {
      var tmp = c.split(':'),
          screenName = tmp[0],
          componentName = tmp[1],

          screen = this.page.getScreen(screenName),
          component = screen.getComponent(componentName);

      involved[componentName] = component;
    }, this);

    return involved;
  },

  /**
   * @private
   * Checks whether the components that are specified as required in the
   * capability definition are present
   *
   * @returns {Boolean} A boolean value indicating whether the requirements of
   * the capability have been met.
   */
  _checkRequirements : function() {
    var requirementsMet = true;

    dojo.forIn(this.requirements, function(propName, requiredComponentName) {
      requirementsMet = requirementsMet && this.involved[requiredComponentName];
    }, this);

    return requirementsMet;
  },

  /**
   * @private
   * Associates the components specified by the template with the appropriate
   * property names, so that the capability can refer to the components in a
   * predictable manner.
   */
  _doLookups : function() {
    dojo.forIn(this.requirements, function(propName, componentName) {
      this[propName] = this.involved[componentName];
    }, this);
  },

  /**
   * @private
   * Sets up method/event listeners and interactions between components.
   */
  _doConnects : function() {
    dojo.forEach(this.connects, function(c) {
      this.connect.apply(this, c);
    }, this);
  },

  /**
   * Registers a connection with the capability's page, allowing for automatic
   * connection teardown when the page is destroyed.
   */
  connect : function(obj, method, fn) {
    if (dojo.isString(obj)) { obj = this[obj]; }
    this.page.connect(obj, method, dojo.hitch(this, fn));
  }
});

toura.capability = function(name, proto) {
  dojo.declare(
    'toura.capabilities.' +  name,
    [ toura.capabilities._Capability ],
    proto
  );
};
