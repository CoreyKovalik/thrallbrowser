var moment = require('moment');

angular
  .module('thrallbro')
  .filter('isonline', function() {
    return function(character) {
      if (character.is_online) {
        return "Online Now";
      } else {
        return moment.unix(1498556222).format('l');
      }
    }
  });