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

      function loadData() {
        serverPromise = serverthrallapi.getServer(self.serverId);
        charPromise = serverthrallapi.getCharacters(self.serverId);
        clanPromise = serverthrallapi.getClans(self.serverId);

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
            self.characters = characters;
            self.clans = clans;
            self.isLoading = false;
            self.loadingError = false;
          })
          .catch(function(respone) {
            self.isLoading = false;
            self.loadingError = true;
          });
      }

      loadData();
    }
  });
