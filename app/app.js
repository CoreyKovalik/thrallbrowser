window.$ = window.jQuery = require('../vendor/jquery/jquery-3.2.1.min');
window._ = require('lodash');
window.moment = require('moment');
require('angular');
require('angular-route');
require('../vendor/bootstrap/js/bootstrap.min.js');

angular
  .module('thrallbrowser', [
    'ngRoute'
  ]);

require('./app.config.js');

require('./components/character/character.component.js');
require('./components/clanlist/clanlist.component.js');
require('./components/playerlist/playerlist.component.js');
require('./components/server/server.component.js');
require('./components/serverlist/serverlist.component.js');
require('./components/servernavbar/servernavbar.component.js');
require('./core/filters/isonline.filter.js');
require('./core/filters/momentago.filter.js');
require('./core/serverthrallapi.service.js');
