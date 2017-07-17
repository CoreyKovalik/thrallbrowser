window.$ = window.jQuery = require('../vendor/jquery/jquery-3.2.1.min');
window._ = require('lodash');
window.moment = require('moment');
require('angular');
require('angular-route');
require('../vendor/bootstrap/js/bootstrap.min.js');

angular
  .module('thrallbro', [
    'ngRoute'
  ]);

require('./app.config.js');
require('./core/is-online/is-online.filter.js');

require('./components/character-list/character-list.component.js');
require('./components/character-sheet/character-sheet.component.js');
require('./components/server-list/server-list.component.js');