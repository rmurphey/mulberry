dojo.provide('toura.components.NodeTitleBanner');

dojo.require('toura._Component');
dojo.require('toura.ui.BackgroundImage');

dojo.declare('toura.components.NodeTitleBanner', toura._Component, {
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
