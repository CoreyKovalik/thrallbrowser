angular
  .module('thrallbro')
  .component('characterSheet', {
    templateUrl: 'character-sheet/character-sheet.template.html',
    controller: function characterSheetController($http, $routeParams){
      var self = this;

      function loadCharacterData() {
        self.isloading = true;
        $http.get('https://serverthrallapi.herokuapp.com/api/5/characters/' + $routeParams.charID + '?private_secret=200cd768-5b1d-11e7-9e82-d60626067254').then(function(response) {
            self.characters = response.data;
            self.isloading = false;
        });
      }

      loadCharacterData();
      setInterval(loadCharacterData, 62000);
    }
  });