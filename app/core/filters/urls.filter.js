angular
  .module('thrallbrowser')
  .filter('characterUrl', function() {
    return function(characterId, serverId) {
      return '/server/' + serverId + '/characters/' + characterId;
    }
  });

angular
  .module('thrallbrowser')
  .filter('clanUrl', function() {
    return function(clanId, serverId) {
      return '/server/' + serverId + '/clans/' + clanId;
    }
  });

angular
  .module('thrallbrowser')
  .filter('serverUrl', function() {
    return function(serverId) {
      return '/server/' + serverId;
    }
  });

angular
  .module('thrallbrowser')
  .filter('steamUrl', function() {
    return function(steamId) {
      return "http://steamcommunity.com/profiles/" + steamId;
    }
  });
