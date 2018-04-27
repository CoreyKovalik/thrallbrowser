angular
  .module('thrallbrowser')
  .config(function config($routeProvider, $locationProvider) {
    // $locationProvider.hashPrefix('');

    $routeProvider
      .when('/', {
        id: 'server-list',
        template: '<server-list></server-list>'
      })
      .when('/server/:serverId', {
        id: 'server',
        template: '<server></server>'
      })
      .when('/server/:serverId/players', {
        id: 'player-list',
        template: '<player-list></player-list>'
      })
      .when('/server/:serverId/clans', {
        id: 'clan-list',
        template: '<clan-list></clan-list>'
      })
      .when('/server/:serverId/character/:charId', {
        id: 'character',
        template: '<character></character>'
      })
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
