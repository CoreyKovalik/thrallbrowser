angular
  .module('thrallbrowser')
  .component('clan', {
    templateUrl: 'components/clan/clan.template.html',
    controllerAs: 'clanCtrl',
    controller: function clanController($q, $routeParams, serverthrallapi) {
      var self = this;

      self.isLoading = true;
      self.loadingError = false;
      self.serverId = $routeParams.serverId;
      self.clanId = $routeParams.clanId;
      self.sortLastOnline = '-last_online';
      self.sortOnline = '-is_online';
      self.clan = null;
      self.members = null;
      self.averageLevel = null;

      function getAverageLevel(characters)
      {
        if(characters.length == 0)
          return 0;

        let levels = characters.reduce(function(acc, v) { return acc + v.level; }, 0);
        return Math.floor(levels / characters.length);
      }

      function loadData() {
        let clanPromise = serverthrallapi.getClan(self.serverId, self.clanId);
        let charPromise = serverthrallapi.getClanCharacters(self.serverId, self.clanId);

        $q.all([clanPromise, charPromise])
          .then(function(results) {
            clan = results[0]
            characters = results[1]
            self.owner = _.find(characters, function(c) {return c.id == clan.owner_id});
            self.averageLevel = getAverageLevel(characters);
            self.clan = clan;
            self.characters = characters;
            self.isLoading = false;
            self.loadingError = false;
          })
          .catch(function(response) {
            self.isLoading = false;
            self.loadingError = true;
          });
      }

      function sortBy(column, ascending) {
        if(self.currentSort == column)
          self.currentSortAsc = !self.currentSortAsc;
        else
          self.currentSortAsc = true;

        if(ascending != null)
          self.currentSortAsc = ascending;

        self.currentSort = column;

        if(!self.currentSortAsc)
          column = '-' + column;

        self.orderBy = [column, 'clan_name'];
      }

      self.sortBy = sortBy;

      loadData();
    }
  });
