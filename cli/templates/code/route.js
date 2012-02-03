mulberry.route('{{path_matcher}}', function(params, route) {
  /**
   * You will probably want something like this here :)
   */

  var page = mulberry.app.PageFactory.createPage({
    pageController : 'yourCustomPageController',
    params : params
  });

  mulberry.app.UI.showPage(page);
});
