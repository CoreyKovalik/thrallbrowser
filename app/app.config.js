angular
  .module('thrallbrowser')
  .config(function config($routeProvider, $locationProvider) {
    // $locationProvider.hashPrefix('');

    $routeProvider
      .when('/', {
        template: '<server-list></server-list>'
      })
      .when('/server/:serverId', {
        template: '<server></server>'
      })
      .when('/server/:serverId/character/:charId', {
        template: '<character></character>'
      })
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
