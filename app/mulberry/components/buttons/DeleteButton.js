dojo.provide('mulberry.components.buttons.DeleteButton');

dojo.require('mulberry.components.buttons._Button');

dojo.declare('mulberry.components.buttons.DeleteButton', mulberry.components.buttons._Button, {
  templateString : dojo.cache('mulberry.components.buttons', 'DeleteButton/DeleteButton.haml'),

  objId : '',
  deleting: false,

  onClick : function(e) {
    if (this.deleting) {
      this.onDelete(this.objId, this.domNode);
      return;
    }

    dojo.addClass(this.domNode, 'deleting');
    this.deleting = true;
  },

  initializeStrings : function() {
    this.i18n_text = this.getString('DELETE');
  },

  onDelete : function(id, deleteNode) {
    // stub for implementation
  }
});

