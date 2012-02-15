dojo.provide('client.routes');

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
      name : 'index',
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
