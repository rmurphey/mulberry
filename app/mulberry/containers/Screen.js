dojo.provide('mulberry.containers.Screen');

dojo.require('mulberry.containers._LayoutBox');
dojo.require('mulberry.containers.Region');

dojo.declare('mulberry.containers.Screen', [ mulberry.containers._LayoutBox ], {
  templateString : dojo.cache('mulberry.containers', 'Screen/Screen.haml'),
  components : {},

  postCreate : function() {
    this.inherited(arguments);

    this.addClass(this.config.name);

    if (this.config.regions) {
      this.regions = dojo.map(this.config.regions, function(region) {
        return this.adopt(mulberry.containers.Region, {
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
                          .replace('mulberry.components.', '')
                          .replace('client.components.', 'custom.');
    this.components[componentName] = c;
  },

  getComponent : function(n) {
    return this.components[n];
  }
});
