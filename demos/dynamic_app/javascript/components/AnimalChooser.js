dojo.provide('client.components.AnimalChooser');

mulberry.component('AnimalChooser', {
  componentTemplate : dojo.cache('client.components', 'AnimalChooser/AnimalChooser.haml'),
  animalTemplate : toura.haml(dojo.cache('client.components', 'AnimalChooser/Animal.haml')),

  prep : function() {
    this.animals = this.baseObj.animals;
  },

  init : function() {
    this.addClass('loading');
    this.loading = true;
    dojo.addClass(this.rechooser, 'hidden');
    this.connect(this.chooser, 'submit', '_onSubmit');
    this.connect(this.rechooser, 'click', '_rechoose');
  },

  _onSubmit : function(e) {
    e.preventDefault();

    if (this.loading) {
      return;
    }

    var d = dojo.formToObject(this.chooser);

    if (!this._validate(d)) { return; }

    dojo.removeClass(this.rechooser, 'hidden');
    dojo.addClass(this.chooser, 'hidden');
    this.onVote(d.animal);
  },

  _rechoose : function() {
    dojo.addClass(this.rechooser, 'hidden');
    dojo.removeClass(this.chooser, 'hidden');
  },

  _setAnimalsAttr : function(animals) {
    this.loading = false;
    this.removeClass('loading');
    this.animalList.innerHTML = dojo.map(animals, this.animalTemplate).join('');
  },

  onVote : function(animal) {
    // a stub function so we can connect a capability
  },

  _validate : function(d) {
    return !!d.animal;
  }
});
