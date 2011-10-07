dojo.provide('toura.pageControllers.node.Home2');

dojo.require('toura.pageControllers.node._Default');
dojo.require('toura.components.AppNav');

dojo.declare('toura.pageControllers.node.Home2', [ toura.pageControllers.node._Default ], {
  templateString : dojo.cache('toura.pageControllers.node', 'Home2/Home2.haml'),
  useHeaderImage : true,
  postMixInProperties : function() {
    this.inherited(arguments);

    this.placements.push([
      'AppNav',
      {},
      'appNav',
      'replace'
    ]);
  }

});
