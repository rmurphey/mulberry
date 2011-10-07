dojo.provide('toura.pageControllers.node.GridView');

dojo.require('toura.pageControllers.node._Node');

dojo.require('toura.components.BodyText');
dojo.require('toura.components.ChildNodeGrid');
dojo.require('toura.components.PageHeaderImage');

dojo.declare('toura.pageControllers.node.GridView', [ toura.pageControllers.node._Node ], {
  templateString : dojo.cache('toura.pageControllers.node', 'GridView/GridView.haml'),

  postMixInProperties : function() {
    this.inherited(arguments);

    this.node.populateChildren();

    this.placements = [
      [
        'BodyText',
        { node : this.node },
        'bodyText',
        'replace'
      ],

      [
        'ChildNodeGrid',
        { node : this.node },
        'childNodes',
        'replace'
      ]
    ];

    var headerImage = this.node.headerImage[this.device.type];

    if (headerImage && headerImage.original) {
      this.placements.push([
        'PageHeaderImage',
        { node : this.node },
        'headerImage',
        'replace'
      ]);
    }
  }
});
