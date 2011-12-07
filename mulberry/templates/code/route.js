mulberry.route('{{path_matcher}}', function(params, route) {
  /**
   * You will probably want something like this here :)
   */

  var page = toura.app.PageFactory.createPage({
    pageController : 'yourCustomPageController',
    params : params
  });

  toura.app.UI.showPage(page);
});
