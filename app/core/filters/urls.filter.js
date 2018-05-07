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
