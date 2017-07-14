angular
  .module('thrallbro')
  .component('serverList', {
    templateUrl: 'components/server-list/server-list.template.html',
    controllerAs: 'the',
    controller: function serverListController($http, $location){
      var self = this;

      this.serverId = "¯\\_(ツ)_/¯";

      this.goServer = function() {
        $location.url("/server/" + self.serverId);
      }
    }
  });