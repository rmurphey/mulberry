dojo.provide('client.data.Animals');

(function() {

dojo.declare('client.data.Animals', null, {
  target : 'http://localhost:3002',

  vote : function(animal) {
    return dojo.xhrPost({
      url : this.target + '/animals/' + animal + '/vote',
      handleAs : 'json',
      content : {
        username : toura.app.DeviceStorage.get('username')
      },
      headers : {
        'X-Requested-With' : ''
      }
    });
  },

  find : function(animal) {
    return dojo.xhrGet({
      url : this.target + '/animals/' + animal,
      handleAs : 'json',
      headers : {
        'X-Requested-With' : ''
      }
    });
  },

  all : function() {
    if (!this._animals) {
      return dojo.xhrGet({
        url : this.target + '/animals',
        handleAs : 'json',
        onLoad : dojo.hitch(this, function(animals) {
          this._animals = animals;
        }),
        headers : {
          'X-Requested-With' : ''
        }
      });
    }

    return this._animals;
  }
});

var s = dojo.subscribe('/app/ready', function() {
  dojo.unsubscribe(s);
  client.data.Animals = new client.data.Animals();
});

}());
