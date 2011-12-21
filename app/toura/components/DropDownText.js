dojo.provide('toura.components.DropDownText');

dojo.require('toura._Component');
dojo.require('toura.components.BodyText');

dojo.declare('toura.components.DropDownText', toura.components.BodyText, {
  templateString : dojo.cache('toura.components', 'DropDownText/DropDownText.haml'),
  adjustMarkup : function() {
    this.hide(this.textWrapper);
  },

  initializeStrings : function() {
    this.i18n_close = this.getString('CLOSE');
    this.i18n_instructions = this.getString('INSTRUCTIONS');
  },

  setupConnections : function() {
    this.connect(this.openButton, 'click', function() {
      this.hide(this.openButton);
      this.show(this.textWrapper);
    });

    this.connect(this.textWrapper, 'click', function() {
      this.hide(this.textWrapper);
      this.show(this.openButton);
    });
  }
});
