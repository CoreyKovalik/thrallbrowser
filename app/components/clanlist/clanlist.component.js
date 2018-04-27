angular
  .module('thrallbrowser')
  .component('clanList', {
    templateUrl: 'components/clanlist/clanlist.template.html',
    controllerAs: 'clanListCtrl',
    controller: function serverController($q, $routeParams, serverthrallapi) {
      var self = this;

      self.isloading = true;
      self.serverId = $routeParams.serverId;
      self.server = null;
      self.clans = null;

      function loadData() {
        serverPromise = serverthrallapi.getServer(self.serverId);
        charPromise = serverthrallapi.getCharacters(self.serverId);

        $q.all([serverPromise, charPromise])
          .then(function(results) {
            server = results[0]
            clans = results[1]

            self.clans = clans;
            self.server = server
            self.isloading = false;
          })
          .catch(function(respone) {
            self.isloading = false;
            self.fail = true;
          });
      }

      loadData();
      setInterval(loadData, 62000);
    }
  });
