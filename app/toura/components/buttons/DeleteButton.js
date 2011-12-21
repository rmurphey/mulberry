dojo.provide('toura.components.buttons.DeleteButton');

dojo.require('toura.components.buttons._Button');

dojo.declare('toura.components.buttons.DeleteButton', toura.components.buttons._Button, {
  templateString : dojo.cache('toura.components.buttons', 'DeleteButton/DeleteButton.haml'),

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

