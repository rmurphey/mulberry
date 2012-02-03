dojo.provide('toura.components.NodeTitleBanner');

dojo.require('mulberry._Component');
dojo.require('mulberry.ui.BackgroundImage');

dojo.declare('toura.components.NodeTitleBanner', mulberry._Component, {
  templateString : dojo.cache('toura.components', 'NodeTitleBanner/NodeTitleBanner.haml'),
  widgetsInTemplate : true,

  prepareData : function() {
    if (this.node.featuredImage) {
      this.image = this.node.featuredImage[
        this.phone ? 'small' : 'large'
      ];
    } else {
      this.image = false;
    }

    this.parentTitle = this.node.parent && this.node.parent.name;
    this.nodeTitle = this.node.name;
  }
});
