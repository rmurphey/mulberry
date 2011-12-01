dojo.provide('client.stores.{{name}}');

mulberry.stores.local('{{name}}', {
  /*
   * You can create an instance of this store by doing:
   *
   *    var myInstance = new client.stores.{{name}}();
   *
   * You may also wish to uncomment the code at the bottom of this file,
   * which will automatically create an instance of this store when your
   * application loads. The created instance will be available to the rest of
   * your code as client.stores.{{name}}, and the original constructor will no
   * longer exist.
   */
});

/*
(function() {
var s = dojo.subscribe('/app/started', function() {
  client.stores.{{name}} = new client.stores.{{name}}();
  dojo.unsubscribe(s);
});
}());
*/
