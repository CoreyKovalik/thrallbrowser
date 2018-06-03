angular
  .module('thrallbrowser')
  .component('server', {
    templateUrl: 'components/server/server.template.html',
    controllerAs: 'serverCtrl',
    controller: function serverController($q, $routeParams, serverthrallapi) {
      var self = this;

      self.isLoading = true;
      self.loadingError = false;
      self.serverId = $routeParams.serverId;
      self.sortLastOnline = '-last_online';
      self.sortOnline = '-is_online';
      self.server = null;
      self.characters = null;
      self.lastWipeDate = null;
      self.updateServerThrall = false;
      self.updateConfigServerThrall = false;

      function loadData() {
        serverPromise = serverthrallapi.getServer(self.serverId);
        charPromise = serverthrallapi.getCharacters(self.serverId);
        clanPromise = serverthrallapi.widgets.getActiveClans(self.serverId);

        $q.all([serverPromise, charPromise, clanPromise])
          .then(function(results) {
            server = results[0]
            characters = results[1]
            clans = results[2]

            firstCharacter = _.minBy(characters, 'id');
            if(firstCharacter != null)
              self.lastWipeDate = firstCharacter.created

            characters = _.filter(results[1], function(c) {return c.is_online;});

            self.server = server
            self.online_characters = characters;
            self.clans = clans;
            self.isLoading = false;
            self.loadingError = false;

            var reasonablyUpdated =
              self.server.version == '2.1.3' ||
              self.server.version == '2.1.4' ||
              self.server.version == '2.1.5' ||
              self.server.version == 'api';

            if (!reasonablyUpdated)
              self.updateServerThrall = true;

            var notConfigured =
              self.server.query_port == null ||
              self.server.tick_rate == null ||
              self.server.max_players == null;

            if (notConfigured)
              self.updateConfigServerThrall = true;
          })
          .catch(function(respone) {
            self.isLoading = false;
            self.loadingError = true;
          });
      }

      loadData();
    }
  });
