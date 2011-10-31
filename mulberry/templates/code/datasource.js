dojo.provide('client.data.{{name}}');

mulberry.datasource('{{name}}', {
  /*
   * For now, the contents of this are entirely up to you!
   * We're working on a more extensive datasource API.
   *
   * You can create an instance of this datasource by doing:
   *
   *    var myInstance = new client.data.{{name}}();
   *
   * You may also wish to uncomment the code at the bottom of this file,
   * which will automatically create an instance of this datasource when your
   * application loads. The created instance will be available to the rest of
   * your code as client.data.{{name}}, and the original constructor will no
   * longer exist.
   */
});

/*
(function() {
var s = dojo.subscribe('/app/started', function() {
  client.data.{{name}} = new client.data.{{name}}();
  dojo.unsubscribe(s);
});
}());
*/
