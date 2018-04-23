angular
  .module('thrallbrowser')
  .component('serverList', {
    templateUrl: 'components/serverlist/serverlist.template.html',
    controllerAs: 'the',
    controller: function serverListController($location, serverthrallapi) {
      var self = this;

      self.servers = null;

      function goServer(serverId) {
        $location.url("/server/" + serverId);
      }

      function loadServers() {
        serverthrallapi.getServers()
          .then(function(servers) {
            self.servers = servers;
          });
      }

      self.goServer = goServer;

      loadServers();
    }
  });
