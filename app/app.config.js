angular
  .module('thrallbrowser')
  .config(function config($routeProvider, $locationProvider) {
    // $locationProvider.hashPrefix('');

    $routeProvider
      .when('/', {
        id: 'server-list',
        template: '<server-list></server-list>'
      })
      .when('/stats', {
        id: 'stats',
        template: '<stats></stats>'
      })
      .when('/server/:serverId', {
        id: 'server',
        template: '<server></server>'
      })
      .when('/server/:serverId/characters', {
        id: 'player-list',
        template: '<player-list></player-list>'
      })
      .when('/server/:serverId/characters/:characterId', {
        id: 'character',
        template: '<character></character>'
      })
      .when('/server/:serverId/clans', {
        id: 'clan-list',
        template: '<clan-list></clan-list>'
      })
      .when('/server/:serverId/clans/:clanId', {
        id: 'clan',
        template: '<clan></clan>'
      })
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
