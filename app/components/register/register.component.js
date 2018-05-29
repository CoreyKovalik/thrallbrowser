angular
  .module('thrallbrowser')
  .component('register', {
    templateUrl: 'components/register/register.template.html',
    controllerAs: 'registerCtrl',
    controller: function registerController($scope, $q, $route, $routeParams, $location, serverthrallapi) {
      var self = this;

      self.hostname = null;
      self.password = null;
      self.port = null;
      self.private_secret = null;

      function registerServerRCON() {

        serverthrallapi.createServer(self.hostname, self.password, self.port).then(function(response) {
          self.private_secret = response.data.private_secret;
        });
      }

      self.registerServerRCON = registerServerRCON;
    }
  });
