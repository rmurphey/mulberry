dojo.provide('client.capabilities.AnimalVoting');

toura.capability('AnimalVoting', {
  requirements : {
    chooser : 'custom.AnimalChooser',
    results : 'custom.AnimalFavorites'
  },

  connects : [
    [ 'page', 'init', '_setAnimals' ],
    [ 'chooser', 'onVote', '_registerVote' ]
  ],

  _setAnimals : function(animals) {
    this.chooser.set('animals', animals);
    this.results.set('animals', animals);
  },

  _registerVote : function(animal) {
    client.data.Animals.vote(animal).then(dojo.hitch(this.results, 'set', 'animals'));
  }
});
