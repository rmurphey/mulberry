dojo.provide('client.base');

dojo.require('client.routes');
dojo.require('client.components.Twitter');
dojo.require('client.components.HelloWorld')
dojo.require('client.components.PersistentComponent')

dojo.subscribe('/app/ready', function() {
  var h = new client.components.PersistentComponent();
  h.placeAt(dojo.body(), 'last');
  h.init();
});
