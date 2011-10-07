dojo.provide('toura.pageControllers.node._Default');

dojo.require('toura.pageControllers.node._Node');
dojo.require('toura.components.BodyText');
dojo.require('toura.components.ChildNodes');
dojo.require('toura.components.PageHeaderImage');

dojo.declare('toura.pageControllers.node._Default', [ toura.pageControllers.node._Node ], {
  postMixInProperties : function() {
    this.inherited(arguments);

    this.placements = [
      [
        'BodyText',
        { node : this.node },
        'bodyText',
        'replace'
      ],

      [
        'ChildNodes',
        { node : this.node },
        'childNodes',
        'replace'
      ]
    ];

    if (this.useHeaderImage) {
      var headerImage = this.node.headerImage[this.device.type];

      if (headerImage && headerImage.original) {
        this.placements.push([
          'PageHeaderImage',
          { node : this.node },
          'headerImage',
          'replace'
        ]);
      } else {
        dojo.destroy(this.headerImage);
      }
    }
  }
});
