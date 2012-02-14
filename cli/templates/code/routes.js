dojo.provide('client.routes');

/**
 * You can define custom routes here. To add a new route, run:
 *
 *    mulberry create route <path matcher>
 *
 * For example:
 *
 *    mulberry create route '/foo/:bar'
 *
 */
mulberry.routes([
  {
    route : '/home',
    handler : function(params) {
      mulberry.showPage(mulberry.createPage({
        pageDef : 'home'
      }));
    },
    isDefault : true
  }
]);

mulberry.pageDef('home', {
  capabilities : [ ],
  screens : [
    {
      name : 'main',
      regions : [
        {
          className : 'region-1',
          components : [
            'StarterComponent'
          ],
          scrollable : true
        }
      ]
    }
  ]
});
