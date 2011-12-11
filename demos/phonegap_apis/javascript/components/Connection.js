dojo.provide('client.components.Connection');

mulberry.component('Connection', {
  componentTemplate : dojo.cache('client.components', 'Connection/Connection.haml'),

  init : function() {
    this.connect(this.reachableButton, 'click', '_checkReachable');
    this.connect(this.stateButton, 'click', '_checkState');
  },

  _checkReachable : function(e) {
    e.preventDefault();
    toura.app.PhoneGap.network.isReachable().then(dojo.hitch(this, '_showConnection'));
  },

  _checkState : function(e) {
    e.preventDefault();
    var state = toura.app.PhoneGap.network.state();
    this.state.innerHTML = 'State: ' + state.state + ', ' + state.description;
  },

  _showConnection : function(reachable) {
    this.connection.innerHTML = reachable ? 'The network is reachable' : 'The network is not reachable';
  }

});
