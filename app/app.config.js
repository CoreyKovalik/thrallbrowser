angular
  .module('thrallbro')
  .config(function config($routeProvider, $locationProvider) {
    // $locationProvider.hashPrefix('');
    $routeProvider
      .when('/', {
        template: '<server-list></server-list>'
      })
      .when('/server/:serverId', {
        template: '<character-list></character-list>'
      })
      .when('/server/:serverId/character/:charId', {
        template: '<character-sheet></character-sheet>'
      })
      .otherwise('/');
    $locationProvider.html5Mode(true);
    }
  );