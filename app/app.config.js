angular
  .module('thrallbrowser')
  .config(function config($routeProvider, $locationProvider, $compileProvider) {
    // $locationProvider.hashPrefix('');

    $routeProvider
      .when('/', {
        id: 'server-list',
        template: '<div class="bootstrap-iso"><server-list></server-list></div>'
      })
      .when('/stats', {
        id: 'stats',
        template: '<stats></stats>'
      })
      .when('/register', {
        id: 'register',
        template: '<div class="bootstrap-iso"><register></register></div>'
      })
      .when('/server/:serverId', {
        id: 'server',
        template: '<div class="bootstrap-iso"><server></server></div>'
      })
      .when('/server/:serverId/characters', {
        id: 'player-list',
        template: '<div class="bootstrap-iso"><player-list></player-list></div>'
      })
      .when('/server/:serverId/characters/:characterId', {
        id: 'character',
        template: '<div class="bootstrap-iso"><character></character></div>'
      })
      .when('/server/:serverId/clans', {
        id: 'clan-list',
        template: '<div class="bootstrap-iso"><clan-list></clan-list></div>'
      })
      .when('/server/:serverId/clans/:clanId', {
        id: 'clan',
        template: '<div class="bootstrap-iso"><clan></clan></div>'
      })
      .otherwise('/');

    $locationProvider.html5Mode(true);

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|steam|mailto):/);
  });
