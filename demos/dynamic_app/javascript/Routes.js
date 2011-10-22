dojo.provide('client.Routes');

dojo.subscribe('/routes/loaded', function() {
  var factory = toura.app.PageFactory;

  var routes = [
    {
      route : '/login',
      handler : function(params) {
        if (toura.app.DeviceStorage.get('username')) {
          toura.app.Router.go('/animals');
          return;
        }

        var p = factory.createPage({ pageController : 'Login' });
        toura.app.UI.showPage(p);
      },
      isDefault : true
    },

    {
      route : '/animals',
      handler : function(params) {
        var p = factory.createPage({
          pageController : 'AnimalChooser',
          name : 'Choose your favorite animal'
        });

        toura.app.UI.showPage(p);

        // send (maybe) async data to the page
        dojo.when(
          client.data.Animals.all(),
          dojo.hitch(p, 'init')
        );
      }
    },

    {
      route : '/animal/:animalName',
      handler : function(params) {
        var animalName = params.animalName,
            p = factory.createPage({
              pageController : 'AnimalVotes',
              name : 'Votes for ' + animalName,
            });

        toura.app.UI.showPage(p);

        // fetch data, then send to the page
        client.data.Animals.find(animalName).then(dojo.hitch(p, 'init'));
      }
    }
  ];

  dojo.forEach(routes, function(r) {
    toura.app.Router.registerRoute(r.route, r.handler, !!r.isDefault);
  });
});
