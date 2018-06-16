angular
  .module('thrallbrowser')
  .directive('onErrorSrc', function() {
    // SOURCE: https://stackoverflow.com/questions/27549134/angularjs-ng-src-condition-if-not-found-via-url
      return {
          link: function(scope, element, attrs) {
            element.bind('error', function() {
              if (attrs.src != attrs.onErrorSrc) {
                attrs.$set('src', attrs.onErrorSrc);
              }
            });
          }
      }
  });
