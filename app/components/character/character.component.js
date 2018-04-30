angular
  .module('thrallbrowser')
  .component('character', {
    templateUrl: 'components/character/character.template.html',
    controllerAs: 'the',
    controller: function characterSheetController($q, $routeParams, serverthrallapi) {
      var self = this;

      self.isloading = true;
      self.serverId = $routeParams.serverId;
      self.characterId = $routeParams.characterId;

      function loadData() {
        serverPromise = serverthrallapi.getServer(self.serverId);
        charPromise = serverthrallapi.getCharacter(self.serverId, self.characterId);

        $q.all([serverPromise, charPromise])
          .then(function(results) {
            self.server = results[0];
            self.character = results[1];
            self.isloading = false;
          })
          .catch(function(respone) {
            self.isloading = false;
            self.fail = true;
          });
      }

      function roundConcatXYZ(x, y, z) {
        var xx = Math.round(x);
        var yy = Math.round(y);
        var zz = Math.round(z);
        return "(" + xx + ", " + yy + ", " + zz + ")";
      }

      function goServer(serverId) {
        $location.url("/server/" + serverId);
      }

      self.roundConcatXYZ = roundConcatXYZ;
      self.goServer = goServer;

      loadData();
    }
  });
