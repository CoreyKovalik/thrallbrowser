window.$ = window.jQuery = require('../vendor/jquery/jquery-3.2.1.min');
window._ = require('lodash');
window.moment = require('moment');
require('angular');
require('angular-route');
require('angular-right-click');
require('angular-long-press');
require('angularjs-autogrow');
require('../vendor/bootstrap/js/bootstrap.min.js');

angular
  .module('thrallbrowser', [
    'ngRoute',
    'ngRightClick',
    'pr.longpress',
    'angularjs-autogrow'
  ]);

require('./app.config.js');

require('./components/character/character.component.js');
require('./components/clanlist/clanlist.component.js');
require('./components/playerlist/playerlist.component.js');
require('./components/server/server.component.js');
require('./components/clan/clan.component.js');
require('./components/serverlist/serverlist.component.js');
require('./components/servernavbar/servernavbar.component.js');
require('./components/stats/stats.component.js');
require('./components/register/register.component.js');
require('./core/filters/isonline.filter.js');
require('./core/filters/moment.filter.js');
require('./core/filters/urls.filter.js');
require('./core/filters/servername.filter.js');
require('./core/serverthrallapi.service.js');
require('./core/statsdata.service.js');
require('./polyfill.js');
