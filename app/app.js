require('angular');
require('angular-route');

angular
  .module('thrallbro', [
    'ngRoute'
  ]);

require('./app.config.js');
require('./core/is-online/is-online.filter.js');

require('./character-list/character-list.component.js');
require('./character-sheet/character-sheet.component.js');