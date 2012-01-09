dojo.provide('toura.capabilities.Text_ChildNodes');

dojo.require('toura._Capability');

dojo.declare('toura.capabilities.Text_ChildNodes', toura._Capability, {
  requirements : {
    text : 'BodyText',
    childNodes : 'ChildNodes'
  },
  
  connects: [],

  init: function() {
    console.log(this.childNodes.region.domNode, this.childNodes.region.domNode.className);
    if (this.childNodes.children.length === 0) {
      this.childNodes.region.domNode.className += " empty";
    }
    console.log(this.childNodes.region.domNode.className);
  }
});

