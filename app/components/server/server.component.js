angular
  .module('thrallbrowser')
  .component('server', {
    templateUrl: 'components/server/server.template.html',
    controllerAs: 'serverCtrl',
    controller: function serverController($q, $routeParams, serverthrallapi) {
      var self = this;

      self.isloading = true;
      self.serverId = $routeParams.serverId;
      self.sortLastOnline = '-last_online';
      self.sortOnline = '-is_online';
      self.server = null;
      self.characters = null;
      self.lastWipeDate = null;

      function loadData() {
        serverPromise = serverthrallapi.getServer(self.serverId);
        charPromise = serverthrallapi.getCharacters(self.serverId);

        $q.all([serverPromise, charPromise])
          .then(function(results) {
            server = results[0]
            characters = results[1]

            firstCharacter = _.minBy(characters, 'conan_id');
            if(firstCharacter != null) {
              self.lastWipeDate = moment.unix(firstCharacter.created).format('LL');
            }
            self.characters = characters;
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



// this.characters = [
      //   {
      //     //SAMPLE DATA
      //     name: 'nullsoldier',
      //     level: 5,
      //     is_online: false,
      //     steam_id: 123124352523,
      //     conan_id: 1,
      //     server_id: 1,
      //     last_online: 14322352,
      //     last_killed_by: null,
      //     x: 45.545,
      //     y: 8347.43,
      //     z: 232.64,
      //   }, {
      //     name: 'immotal',
      //     level: 34,
      //     is_online: true,
      //     steam_id: 67642313,
      //     conan_id: 2,
      //     server_id: 1,
      //     last_online: 1632200,
      //     last_killed_by: 1,
      //     x: 876.343,
      //     y: 6464.232,
      //     z: 1232.434,
      //   }
      // ];
