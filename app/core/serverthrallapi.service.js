angular
  .module('thrallbrowser')
  .service('serverthrallapi', function($http) {
    var self = this;

    var root_api = 'https://serverthrallapi.herokuapp.com/api/';
    // root_api = 'http://localhost:8000/api/';

    function processClan(clan) {
      if(clan.created != null)
        clan.created = moment(clan.created * 1000);
      clan.is_active = clan.active_count > 0
      return clan;
    }

    function processCharacter(character) {
      if(character.created != null)
        character.created = moment(character.created * 1000);
      return character;
    }

    function processServer(server) {
      if(server.name.startsWith('"'))
        server.name = server.name.substring(1);
      if(server.name.endsWith('"'))
        server.name = server.name.substring(0, server.name.length-1);
      if(server.last_sync != null)
        server.last_sync = moment(server.last_sync * 1000);
      return server;
    }

    function getCharacters(serverId) {
      return $http.get(root_api + serverId + '/characters').then(function(response) {
        return _.map(response.data, processCharacter);
      });
    }

    function getCharacter(serverId, characterId)
    {
      return $http.get(root_api + serverId + '/characters/' + characterId).then(function(response) {
        return processCharacter(response.data);
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

    function getClanCharacters(serverId, clanId)
    {
      return $http.get(root_api + serverId + '/clans/' + clanId + '/characters').then(function(response) {
        return _.map(response.data, processCharacter);
      });
    }

    function getServers()
    {
      return $http.get(root_api).then(function(response) {
        return _.map(response.data.items, processServer);
      });
    }

    function getServer(serverId)
    {
      return $http.get(root_api + serverId).then(function(response) {
        return processServer(response.data);
      });
    }

    function getActiveClans(serverId)
    {
      return $http.get(root_api + serverId + '/widgets/activeclans').then(function(response) {
        return _.map(response.data, processClan);
      });
    }

    function getServerInfo()
    {
      return $http.get(root_api + 'widgets/serverinfo').then(function(response) {
        return response.data;
      });
    }

    self.getCharacter = getCharacter;
    self.getCharacters = getCharacters;
    self.getClan = getClan;
    self.getClanCharacters = getClanCharacters;
    self.getClans = getClans;
    self.getServer = getServer;
    self.getServers = getServers;

    self.widgets = {}
    self.widgets.getServerInfo = getServerInfo;
    self.widgets.getActiveClans = getActiveClans;
  });
