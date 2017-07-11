angular
  .module('thrallbro')
  .component('characterSheet', {
    templateUrl: 'character-sheet/character-sheet.template.html',
    controllerAs: 'the',
    controller: function characterSheetController($http, $routeParams){
      var self = this;

      self.isloading = true;
      function loadCharacterData() {
        $http.get('https://serverthrallapi.herokuapp.com/api/' + $routeParams.serverId + '/characters/' + $routeParams.charId + '?private_secret=200cd768-5b1d-11e7-9e82-d60626067254').then(function(response) {
            self.char = response.data;
            self.isloading = false;
        })
        .catch(function(respone) {
          console.log("Error: Invalid charId in URL")
          self.isloading = false;
          self.fail = true;
        });
      }

      loadCharacterData();
      setInterval(loadCharacterData, 62000);
    }
  });