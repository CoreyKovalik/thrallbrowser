angular
  .module('thrallbrowser')
  .component('serverList', {
    templateUrl: 'components/serverlist/serverlist.template.html',
    controllerAs: 'serverListCtrl',
    controller: function serverListController($location, serverthrallapi) {
      var self = this;

      self.isLoading = true;
      self.loadingError = false;
      self.servers = null;
      self.orderBy = [];
      self.currentSort = null;
      self.currentSortAsc = true;

      function goServer(serverId) {
        $location.url("/server/" + serverId);
      }

    function loadServers() {
        serverthrallapi.getServers()
          .then(function(servers) {
            self.servers = servers;
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

        self.orderBy = [column];
      }

      self.goServer = goServer;
      self.sortBy = sortBy;

      self.orderBy = ['-online_count', '-character_count'];
      self.currentSortAsc = false;
      self.currentSort = 'online_count';

      loadServers();
    }
  });
