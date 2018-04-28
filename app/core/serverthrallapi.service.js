angular
  .module('thrallbrowser')
  .service('serverthrallapi', function($http) {
    var self = this;

    var root_api = 'https://serverthrallapi.herokuapp.com/api/';
    // root_api = 'http://localhost:8000/api/';

    function processClan(clan) {
      if(clan.created != null)
        clan.created = moment.unix(clan.created);
      return clan;
    }

    function processCharacter(character) {
      if(character.created != null)
        character.created = moment.unix(character.created);
      return character;
    }

    function getCharacters(serverId) {
      return $http.get(root_api + serverId + '/characters').then(function(response) {
        return _.map(response.data, processCharacter);
      });
    }

    function getCharacter(serverId, characterId)
    {
      return $http.get(root_api + serverId + '/characters/' + characterId).then(function(response) {
        return processCharcter(response.data);
      });
    }

    function getClans(serverId)
    {
      return $http.get(root_api + serverId + '/clans').then(function(response) {
        return _.map(response.data, processClan);
      });
    }

    function getClan(serverId, clanId)
    {
      return $http.get(root_api + serverId + '/clans/' + clanId).then(function(response) {
        return processClan(response.data);
      });
    }

    function getServers()
    {
      return $http.get(root_api).then(function(response) {
        return response.data.items;
      });
    }

    function getServer(serverId)
    {
      return $http.get(root_api + serverId).then(function(response) {
        return response.data;
      });
    }

    self.getCharacter = getCharacter;
    self.getCharacters = getCharacters;
    self.getClan = getClan;
    self.getClans = getClans;
    self.getServer = getServer;
    self.getServers = getServers;
  });
