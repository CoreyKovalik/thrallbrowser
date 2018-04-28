angular
  .module('thrallbrowser')
  .filter('momentago', function() {
    return function(time) {
      if(time == null)
        return 'Never';
      return time.fromNow();
    }
  });
