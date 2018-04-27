angular
  .module('thrallbrowser')
  .component('serverNavbar', {
    templateUrl: 'components/servernavbar/servernavbar.template.html',
    controllerAs: 'navbarCtrl',
    controller: function serverController($q, $route, $routeParams) {
      var self = this;
      self.routeId = $route.current.$$route.id;
      self.serverId = $routeParams.serverId;
    }
  });
