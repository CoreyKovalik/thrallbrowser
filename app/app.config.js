angular
  .module('thrallbro')
  .config(function config($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider
    debugger
      .when('/character-list', {
        template: '<character-list></character-list>'
      })
      .when('/character-list/:charId', {
        template: '<character-sheet></character-sheet>'
      })
      .otherwise('/character-list');
    }
  );
