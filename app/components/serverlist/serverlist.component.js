angular
  .module('thrallbrowser')
  .component('serverList', {
    templateUrl: 'components/serverlist/serverlist.template.html',
    controllerAs: 'serverListCtrl',
    controller: function serverListController($location, $q, serverthrallapi) {
      var self = this;

      self.isLoading = true;
      self.loadingError = false;
      self.info = null;
      self.servers = null;
      self.orderBy = [];
      self.currentSort = null;
      self.currentSortAsc = true;

      function goServer(serverId) {
        $location.url("/server/" + serverId);
      }

    function loadData() {
        var serversPromise = serverthrallapi.getServers().then(function(servers) {
          self.servers = servers;
        });

        var infoPromise = serverthrallapi.widgets.getServerInfo().then(function(info) {
          self.info = info;
        });

        $q.all([serversPromise, infoPromise]).then(function() {
          self.isLoading = false;
          self.loadingError = false;
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

      loadData();
    }
  });
