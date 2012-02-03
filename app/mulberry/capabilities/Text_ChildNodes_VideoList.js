dojo.provide('mulberry.capabilities.Text_ChildNodes_VideoList');

dojo.require('mulberry._Capability');

dojo.declare('mulberry.capabilities.Text_ChildNodes_VideoList', mulberry._Capability, {
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

