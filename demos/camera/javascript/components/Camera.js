dojo.provide('client.components.Camera');

mulberry.component('Camera', {
  componentTemplate : dojo.cache('client.components', 'Camera/Camera.haml'),

  init : function() {
    this.connect(this.pictureButton, 'click', '_takePicture');
  },

  _takePicture : function(e) {
    e.preventDefault();
    toura.app.PhoneGap.camera.getPicture({
      destinationType : navigator.camera.DestinationType.FILE_URI
    }).then(dojo.hitch(this, '_showPicture'));
  },

  _showPicture : function(src) {
    var pic = new Image();
    pic.src = src;
    pic.width = 200;
    dojo.place(pic, this.gallery);
    dojo.publish('/content/update'); // refresh the scroller
  }
});
