dojo.provide('client.components.AnimalFavorites');

mulberry.component('AnimalFavorites', {
  componentTemplate : dojo.cache('client.components', 'AnimalFavorites/AnimalFavorites.haml'),
  animalCountTemplate : toura.haml(dojo.cache('client.components', 'AnimalFavorites/Animal.haml')),

  _setAnimalsAttr : function(animals) {
    this.animals = dojo.map(animals, function(animal) {
      return dojo.mixin(animal, { count : animal.votes.length });
    });

    this._populate();
  },

  _populate : function() {
    this.domNode.innerHTML = dojo.map(
      this.animals, this.animalCountTemplate, this
    ).join('');
  }
});
