angular
  .module('thrallbrowser')
  .filter('momentAgo', function() {
    return function(time) {
      if(time == null)
        return 'Never';
      return time.fromNow();
    }
  });

angular
  .module('thrallbrowser')
  .filter('momentDate', function() {
    return function(time) {
      if(time == null)
        return 'Never';
      return time.format('LL');
    }
  });
