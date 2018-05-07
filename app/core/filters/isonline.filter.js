angular
  .module('thrallbrowser')
  .filter('isCharacterOnline', function() {
    return function(character) {
      if (character.is_online)
        return "Online Now";
      return moment.unix(character.last_online).fromNow();
    }
  });
