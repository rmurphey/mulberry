dojo.provide('client.components.AnimalVotes');

mulberry.component('AnimalVotes', {
  componentTemplate : dojo.cache('client.components', 'AnimalVotes/AnimalVotes.haml'),
  votersTemplate : toura.haml(dojo.cache('client.components', 'AnimalVotes/Voters.haml')),

  prep : function() {
    this.connect(this.page, 'init', dojo.hitch(this, 'set', 'animal'));
  },

  _setAnimalAttr : function(animal) {
    animal.count = animal.votes.length;

    this.voters.innerHTML = dojo.map(animal.votes, function(voter) {
      return this.votersTemplate({ name : voter });
    }, this).join('');

    this.title.innerHTML = toura.tmpl(
      '${count} votes for ${name}',
      animal
    );
  }
});
