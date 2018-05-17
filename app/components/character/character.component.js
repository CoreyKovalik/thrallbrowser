angular
  .module('thrallbrowser')
  .component('character', {
    templateUrl: 'components/character/character.template.html',
    controllerAs: 'characterCtrl',
    controller: function characterSheetController($q, $routeParams, serverthrallapi) {
      var self = this;

      self.isLoading = true;
      self.loadingError = null;
      self.serverId = $routeParams.serverId;
      self.characterId = $routeParams.characterId;

      function loadData() {
        serverPromise = serverthrallapi.getServer(self.serverId);
        charPromise = serverthrallapi.getCharacter(self.serverId, self.characterId);

        $q.all([serverPromise, charPromise])
          .then(function(results) {
            self.server = results[0];
            self.character = results[1];
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
