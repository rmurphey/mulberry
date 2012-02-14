/**
 * You can write custom JavaScript here; this is also where Mulberry will add
 * any dependencies you introduce via `mulberry create component`.
 */

dojo.subscribe('/app/deviceready', function() {
  mulberry.app.Config.set('app', { name : 'MyApp' });
  mulberry.registerComponentNamespace(client.components);

  setTimeout(function() {
    dojo.publish('/app/ready');
  }, 10);
});

