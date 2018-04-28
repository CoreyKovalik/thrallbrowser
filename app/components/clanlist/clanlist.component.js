angular
  .module('thrallbrowser')
  .component('clanList', {
    templateUrl: 'components/clanlist/clanlist.template.html',
    controllerAs: 'clanListCtrl',
    controller: function serverController($q, $routeParams, serverthrallapi) {
      var self = this;

      self.serverId = $routeParams.serverId;
      self.isLoading = true;
      self.loadingError = null;
      self.server = null;
      self.clans = null;
      self.orderBy = [];
      self.currentSort = null;
      self.currentSortAsc = true;

      function loadData() {
        serverPromise = serverthrallapi.getServer(self.serverId);
        clanPromise = serverthrallapi.getClans(self.serverId);

        $q.all([serverPromise, clanPromise])
          .then(function(results) {
            self.server = results[0];
            self.clans = results[1];
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

        self.orderBy = [column, 'name'];
      }

      self.sortBy = sortBy;

      sortBy('character_count', false)
      loadData();
      setInterval(loadData, 62000);
    }
  });
