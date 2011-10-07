dojo.provide('toura.pageControllers.node.StaticMapImages1');

dojo.require('toura.pageControllers.node.Images1');

dojo.declare('toura.pageControllers.node.StaticMapImages1', [ toura.pageControllers.node.Images1 ], {
  postMixInProperties : function() {
    this.node = dojo.mixin({}, this.node);
    this.node.images = this.node.staticMapImages;

    this.inherited(arguments);
  }
});

