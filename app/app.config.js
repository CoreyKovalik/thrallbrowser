angular
  .module('thrallbro')
  .config(function config($routeProvider, $locationProvider) {
    // $locationProvider.hashPrefix('');
    $routeProvider
      .when('/', {
        template: '<character-list></character-list>'
      })
      .when('/character' + ':charId', {
        template: '<character-sheet></character-sheet>'
      })
      .otherwise('/');
    $locationProvider.html5Mode(true);
    }
  );