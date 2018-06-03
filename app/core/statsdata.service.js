angular
  .module('thrallbrowser')
  .service('statsdata', function($http) {
    var self = this;

    var statsRoot = '../data/components/stats/';

    function getArmorsData() {
      return $http.get(statsRoot + 'armor.json').then(function(response) {
        return response.data;
      });
    }


    function getWeaponsData() {
      return $http.get(statsRoot + 'weapons.json').then(function(response) {
        return response.data;
      });
    }


    self.getArmorsData = getArmorsData;
    self.getWeaponsData = getWeaponsData;

    self.test = getArmorsData();

  });
