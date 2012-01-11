dojo.provide('toura.capabilities.Text_ChildNodes_VideoList');

dojo.require('toura._Capability');

dojo.declare('toura.capabilities.Text_ChildNodes_VideoList', toura._Capability, {
  requirements : {
    text : 'BodyText',
    childNodes : 'ChildNodes',
    videoList: 'VideoList'
  },

  init: function() {
    if (this.childNodes.children.length === 0 && this.videoList.assets.length <= 1) {
      dojo.addClass(this.childNodes.region.domNode, 'empty');
    }
  }
});

