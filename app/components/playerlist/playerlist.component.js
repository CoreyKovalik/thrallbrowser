angular
  .module('thrallbrowser')
  .component('playerList', {
    templateUrl: 'components/playerlist/playerlist.template.html',
    controllerAs: 'playerListCtrl',
    controller: function serverController($q, $routeParams, serverthrallapi) {
      var self = this;

      self.isLoading = true;
      self.loadingError = null;
      self.serverId = $routeParams.serverId;
      self.sortLastOnline = '-last_online';
      self.sortOnline = '-is_online';
      self.server = null;
      self.characters = null;
      self.lastWipeDate = null;
      self.orderBy = [];
      self.currentSort = null;
      self.currentSortAsc = true;

      function loadData() {
        serverPromise = serverthrallapi.getServer(self.serverId);
        charPromise = serverthrallapi.getCharacters(self.serverId);

        $q.all([serverPromise, charPromise])
          .then(function(results) {
            self.server = results[0]
            self.characters = results[1];
            self.isLoading = false;
            self.loadingError = null;
          })
          .catch(function(respone) {
            self.isLoading = false;
            self.loadingError = 'FAIL_LOAD';
          });
      }

      function sortBy(column, ascending) {
        if(self.currentSort == column)
          self.currentSortAsc = !self.currentSortAsc;
        else
          self.currentSortAsc = true;

        if(ascending != null)
          self.currentSortAsc = ascending;

        self.currentSort = column;

        if(!self.currentSortAsc)
          column = '-' + column;

        self.orderBy = [column, 'clan_name'];
      }

      self.sortBy = sortBy;

      sortBy('last_online', false);
      loadData();
      setInterval(loadData, 62000);
    }
  });
