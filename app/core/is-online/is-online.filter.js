angular
  .module('thrallbro')
  .filter('isonline', function() {
    return function(character) {
      if (character.is_online) {
        return "Online Now";
      } else {
        return moment.unix(character.last_online).fromNow();
      }
    }
  });