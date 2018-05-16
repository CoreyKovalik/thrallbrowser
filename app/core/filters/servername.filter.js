angular
  .module('thrallbrowser')
  .filter('serverName', function() {
    return function(serverName) {
      if(serverName == null || serverName.length == 0)
        return 'NO SERVER NAME';
      return serverName;
    }
  });