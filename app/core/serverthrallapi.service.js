angular
  .module('thrallbrowser')
  .service('serverthrallapi', function($http) {
    var self = this;

    var root_api = 'https://serverthrallapi.herokuapp.com/api/';
    // root_api = 'http://localhost:8000/api/';

    function getCharacters(serverId) {
      return $http.get(root_api + serverId + '/characters').then(function(response) {
        return response.data;
      });
    }

    function getCharacter(serverId, characterId)
    {
      return $http.get(root_api + serverId + '/characters/' + characterId).then(function(response) {
        return response.data;
      });
    }

    function getClans(serverId)
    {
      return $http.get(root_api + serverId + '/clans').then(function(response) {
        return response.data;
      });
    }

    function getClan(serverId, clanId)
    {
      return $http.get(root_api + serverId + '/clans/' + clanId).then(function(response) {
        return response.data;
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
