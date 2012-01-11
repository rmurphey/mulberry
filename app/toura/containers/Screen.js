dojo.provide('toura.containers.Screen');

dojo.require('toura.containers._LayoutBox');
dojo.require('toura.containers.Region');

dojo.declare('toura.containers.Screen', [ toura.containers._LayoutBox ], {
  templateString : dojo.cache('toura.containers', 'Screen/Screen.haml'),
  components : {},

  postCreate : function() {
    this.inherited(arguments);

    this.addClass(this.config.name);

    if (this.config.regions) {
      this.regions = dojo.map(this.config.regions, function(region) {
        return this.adopt(toura.containers.Region, {
          page : this.page,
          config : region,
          baseObj : this.baseObj,
          device : this.device,
          screen : this,
          backgroundImage : this.backgroundImage
        }).placeAt(this.domNode);
      }, this);
    }
  },

  registerComponent : function(c) {
    var componentName = c.declaredClass
                          .replace('toura.components.', '')
                          .replace('client.components.', 'custom.');
    this.components[componentName] = c;
  },

  getComponent : function(n) {
    return this.components[n];
  }
});
