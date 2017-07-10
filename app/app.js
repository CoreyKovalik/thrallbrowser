window.$ = window.jQuery = require('./js/jquery-3.2.1.min');
window._ = require('lodash');
require('angular');
require('angular-route');
require('./js/bootstrap.min.js');

angular
  .module('thrallbro', [
    'ngRoute'
  ]);

require('./app.config.js');
require('./core/is-online/is-online.filter.js');

require('./character-list/character-list.component.js');
require('./character-sheet/character-sheet.component.js');