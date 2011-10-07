dojo.provide('toura.pageControllers.node.Images2');

dojo.require('toura.pageControllers.node._Node');
dojo.require('toura.components.ImageDetail');

dojo.declare('toura.pageControllers.node.Images2', [ toura.pageControllers.node._Node ], {
  templateString : dojo.cache('toura.pageControllers.node', 'Images2/Images2.haml'),

  postMixInProperties : function() {
    this.inherited(arguments);

    this.placements = [
      [
        'ImageDetail',
        { node : this.node, main : true },
        'detail',
        'replace'
      ]
    ];
  },

  startup : function() {
    this.inherited(arguments);

    this.detail.set('active', true);
    this.detail.set('currentImageIndex', 0);
    this.detail.showNav();
  }

});
