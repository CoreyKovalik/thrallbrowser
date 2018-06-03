angular
  .module('thrallbrowser')
  .component('stats', {
    templateUrl: 'components/stats/stats.template.html',
    controllerAs: 'statsCtrl',
    controller: function statsCalculatorController($scope, $q, $route, $routeParams, $location) {
    var self = this;

    //start calc
    // better image preloading @ https://perishablepress.com/press/2009/12/28/3-ways-preload-images-css-javascript-ajax/
    // pre-loaded for prettier rendering when transitioning between attribute teirs
    function preloader() {
      if (document.images) {
        var img1 = new Image();
        var img2 = new Image();
        var img3 = new Image();
        var img4 = new Image();
        var img5 = new Image();

        var img6 = new Image();
        var img7 = new Image();
        var img8 = new Image();
        var img9 = new Image();
        var img10 = new Image();

        img1.src = "./images/teir1.png";
        img2.src = "./images/teir2.png";
        img3.src = "./images/teir3.png";
        img4.src = "./images/teir4.png";
        img5.src = "./images/teir5.png";

        img6.src = "./images/t1-glow.png";
        img7.src = "./images/t2-glow.png";
        img8.src = "./images/t3-glow.png";
        img9.src = "./images/t4-glow.png";
        img10.src = "./images/t5-glow.png";
      }
    }
    function addLoadEvent(func) {
      var oldonload = window.onload;
      if (typeof window.onload != 'function') {
        window.onload = func;
      } else {
        window.onload = function() {
          if (oldonload) {
            oldonload();
          }
          func();
        }
      }
    }
    addLoadEvent(preloader);
    //end conan-image-preloader
    //start conan-stat-data

    self.EXP_ARRAY = [0,275,1325,3675,7825,14325,23675,36400,53000,74000,99925,131300,168625,212450,263275,321600,387975,462900,546900,640475,744175,858500,983975,1121100,1270400,1432400,1607625,1796600,1999825,2217825,2451125,2700225,2965650,3247925,3547575,3865100,4201025,4555875,4930175,5324425,5739150,6174875,6632125,7111400,7613225,8138125,8686600,9259175,9856375,10478725,11126725,11800925,12501825,13229925,13985775,14769875,15582750,16424900,17296850,18199150,19132275];

    self.stats = {
      "characterLevel": 1,
      "unspentPoints": 1,
      "spentPoints": 0,
      "availableFeats": 0,
      "currentExperience": "0 / 275",
      "allStats": ["strength", "agility", "vitality", "accuracy", "grit", "encumbrance", "survival"],
      "strength": {
        "value": 0,
        "_10": false,
        "_20": false,
        "_30": false,
        "_40": false,
        "_50": false
      },
      "agility": {
        "value": 0,
        "_10": false,
        "_20": false,
        "_30": false,
        "_40": false,
        "_50": false
      },
      "vitality": {
        "value": 0,
        "_10": false,
        "_20": false,
        "_30": false,
        "_40": false,
        "_50": false
      },
      "accuracy": {
        "value": 0,
        "_10": false,
        "_20": false,
        "_30": false,
        "_40": false,
        "_50": false
      },
      "grit": {
        "value": 0,
        "_10": false,
        "_20": false,
        "_30": false,
        "_40": false,
        "_50": false
      },
      "encumbrance": {
        "value": 0,
        "_10": false,
        "_20": false,
        "_30": false,
        "_40": false,
        "_50": false
      },
      "survival": {
        "value": 0,
        "_10": false,
        "_20": false,
        "_30": false,
        "_40": false,
        "_50": false
      },
      "playerStats": {
        "health": {
          "value": 200,
          "base": 200
        },
        "stamina": {
          "value": 100,
          "base": 100
        },
        "encumbrance": {
          "value": 70,
          "base": 70
        },
        "melee": {
          "value": 100,
          "base": 100
        },
        "ranged": {
          "value": 100,
          "base": 100
        },
        "armor": {
          "value": 0,
          "base": 0
        },
        "damageResistance": {
          "value": 0,
          "base": 0
        }
      }
    }

    function resetAll() {
      self.stats.strength.value = self.stats.agility.value = self.stats.vitality.value = self.stats.accuracy.value = self.stats.grit.value = self.stats.encumbrance.value = self.stats.survival.value = self.stats.spentPoints = self.stats.availableFeats = 0;
      self.stats.characterLevel = self.stats.unspentPoints = 1;
      self.stats.currentExperience = "0 / 275";
      self.stats.playerStats.health.value = self.stats.playerStats.health.base;
      self.stats.playerStats.stamina.value = self.stats.playerStats.melee.value = self.stats.playerStats.ranged.value = self.stats.playerStats.stamina.base;
      self.stats.playerStats.encumbrance.value = self.stats.playerStats.encumbrance.base;
      self.stats.playerStats.armor.value = self.stats.playerStats.damageResistance.value = self.stats.playerStats.armor.base;
      for (var i = 0; i < 7; i++) {
        update(self.stats.allStats[i]);
      }
    }

    function resetAttributes() {
      self.stats.allStats.forEach(function(attribute) {
        resetAttribute(attribute);
      });
    }

    function resetAttribute(attribute) {
      while (self.stats[attribute].value > 0) {
        statDown(attribute);
      }
    }

    function increaseLevelTo(value)
    {
      while (self.stats.characterLevel < value) {
        if(!levelUp())
          return false;
      }
      return true;
    }

    function maxOutLevel() {
      increaseLevelTo(60);
    }

    function levelStatTo(statName, value)
    {
      while (self.stats[statName].value < value) {
        if (getAttrCost(self.stats[statName].value) > self.stats.unspentPoints)
          return false;
        if(!statUp(statName))
          return false;
      }

      return true;
    }

    function maxOutAttribute(attribute) {
      levelStatTo(attribute, 50);
    }

    function setCurrentExperience(currentlevel) {
      self.stats.currentExperience = self.EXP_ARRAY[currentlevel - 1].toLocaleString() + " / " + self.EXP_ARRAY[currentlevel].toLocaleString();
      return self.EXP_ARRAY[currentlevel -1];
    }

    function getAttrCost(currentlevel) {
      let i = 0;
      let comparelvl = 0;
      let cost = 0;
      while (i < 10) {
        if (currentlevel < comparelvl + 5) return cost + 1;
        else i++, cost++, comparelvl += 5;
      }
    }

    function adjustAttrPoints(currentlevel) {
      let i = 0;
      let comparelvl = 0;
      let attrPoints = 0;
      while (i < 13) {
        if (currentlevel <= comparelvl + 5) return attrPoints + 1;
        else i++, attrPoints++, comparelvl += 5;
      }
    }

    function adjustFeatPoints(currentlevel) {
      let i = 0, x = 1;
      let comparelvl = 0;
      let featPoints = 0;
      while (i < 13) {
        if (currentlevel < comparelvl + 5) {
          featPoints ++;
          while (x < 7) {
            if (currentlevel == x * 10) return featPoints * 3;
            x++;
          }
          return featPoints;
        }
        else i++, featPoints++, comparelvl += 5;
      }
    }

    //Checks current attributes and determines attribute bonuses @ lvls 10,20,30,40,50

    function adjustBonuses(statString) {
      if (statString == null) return false;
        for (var i = 1; i <= 5; i++) {
        let teir = "_" + i + "0";
        let lvl = i * 10;
        self.stats[statString].value >= lvl ? self.stats[statString][teir] = true : self.stats[statString][teir] = false;
      }
    }

    //Math calculations for playerStats based on attributes and certain bonus perks

    function calcPlayerStats() {
      self.stats.playerStats.health.value = (8 * self.stats.vitality.value) + self.stats.playerStats.health.base;
      self.stats.playerStats.stamina.value = (3 * self.stats.grit.value) + self.stats.playerStats.stamina.base;
      self.stats.playerStats.encumbrance.value = (7 * self.stats.encumbrance.value) + self.stats.playerStats.encumbrance.base;
      self.stats.playerStats.melee.value = Math.round((100 * 0.025 * self.stats.strength.value) + self.stats.playerStats.melee.base);
      self.stats.playerStats.ranged.value = Math.round((100 * 0.025 * self.stats.accuracy.value) + self.stats.playerStats.ranged.base);
        if(self.stats.accuracy._30) self.stats.playerStats.ranged.value += 10;
      self.stats.playerStats.armor.value = (2 * self.stats.agility.value) + self.stats.playerStats.armor.base;
        if(self.stats.grit._30) self.stats.playerStats.armor.value += 15;
      self.stats.playerStats.damageResistance.value = precisionRound((self.stats.playerStats.armor.value * 0.003 * 100),1);
        if(self.stats.encumbrance._30) self.stats.playerStats.encumbrance.value += self.stats.playerStats.encumbrance.value * .1;
    }

    function adjustProgress(statString) {
      if (statString == null) return false;

      let statProgress = (self.stats[statString].value / 50) * 100;
      document.getElementsByClassName("progress " + statString)[0].setAttribute("style", "width:" + statProgress + "%;");

      for (var i = 1; i <= 5; i++) {
        let teir = "_" + i + "0";
        if (self.stats[statString][teir]) {
          document.getElementsByClassName("progress-bar " + statString)[0].classList.add("perk-" + i);
          document.getElementsByClassName("bonus-icon bonus-teir" + i + " " + statString)[0].setAttribute("src", "./images/t" + i + "-glow.png");
        }
        else {
          document.getElementsByClassName("progress-bar " + statString)[0].classList.remove("perk-" + i);
          document.getElementsByClassName("bonus-icon bonus-teir" + i + " " + statString)[0].setAttribute("src", "./images/t" + i + ".png");
        }
      }
    }

    //end conan-stat-data
    //start conan-stat-calc

    // Update & adjustment functions //
    function update(statString) {
      adjustBonuses(statString);
      calcPlayerStats();
      adjustProgress(statString);
      updateQueryParams();
    }

    // Increase/Decrease stat functions
    function levelUp() {
      if (self.stats.characterLevel == 60)
        return false;
      self.stats.characterLevel += 1;
      setCurrentExperience(self.stats.characterLevel);
      self.stats.unspentPoints += adjustAttrPoints(self.stats.characterLevel);
      self.stats.availableFeats += adjustFeatPoints(self.stats.characterLevel);
      update();
      return true;
    }

    function levelDown() {
      if (self.stats.characterLevel == 1)
        return false;
      if (self.stats.characterLevel == 60) {
        document.getElementsByClassName("level-up")[0].disabled = false;
        document.getElementsByClassName("max-level")[0].disabled = false;
      }
      if (self.stats.unspentPoints < adjustAttrPoints(self.stats.characterLevel)) {
        return alert("You must first remove attributes before leveling down your Exile.  You cannot remove what you've already spent!");
      }
      self.stats.unspentPoints -= adjustAttrPoints(self.stats.characterLevel);
      self.stats.availableFeats -= adjustFeatPoints(self.stats.characterLevel);
      self.stats.characterLevel -= 1;
      setCurrentExperience(self.stats.characterLevel);
      update();
      return true;
    }

    function statUp(statString) {
      let stat = self.stats[statString].value;
      let cost = getAttrCost(stat);

      if (stat == 50)
        return false;
      if (cost > self.stats.unspentPoints)
        return false;

      stat += 1;
      self.stats.unspentPoints -= cost;
      self.stats.spentPoints += cost;
      self.stats[statString].value = stat;
      update(statString);
      return true;
    }

    function statDown(statString) {
      let stat = self.stats[statString].value;
      if (stat == 0)
        return false;

      stat -= 1;
      let cost = getAttrCost(stat);
      self.stats.unspentPoints += cost;
      self.stats.spentPoints -= cost;
      self.stats[statString].value = stat;
      update(statString);
      return true;
    }

    function loadQueryParams()
    {
      var values = $location.search().v;
      if(!values || !values.split)
        return;

      var s = values.split(":");

      function takeStat() {
        return s.length == 0 ? null : Number(s.shift());
      }

      var level = takeStat();
      if(level != null)
        increaseLevelTo(level);

      self.stats.allStats.forEach(function(attribute, i) {
        let statName = self.stats.allStats[i];
        let statTarget = takeStat();

        if(statTarget != null)
          levelStatTo(statName, statTarget);
      });
    }

    function updateQueryParams()
    {
      $location.search('v',
        self.stats.characterLevel + ':' +
        self.stats.strength.value + ':'+
        self.stats.agility.value + ':'+
        self.stats.vitality.value + ':'+
        self.stats.accuracy.value + ':'+
        self.stats.grit.value + ':'+
        self.stats.encumbrance.value + ':'+
        self.stats.survival.value);
    }

    // Helper Functions //

    let mouseHoldInterval = 0;

    function onMouseHold(func, statString) {
      mouseHoldInterval = setInterval(function() {
        if (statString) func(statString);
        else func();

        $scope.$digest()

      }, 140);
    }

    function clearMouseHold() {
      clearInterval(mouseHoldInterval);
    }

    function precisionRound(number, precision) {
      var factor = Math.pow(10, precision);
      return Math.round(number * factor) / factor;
    }

    let currentActive = "strength";

    self.stats.allStats.forEach(function(attribute, i) {

      //cache attr-div & progress-bar for each attribute. then,
      let hoverElementsForToggle = [];
      hoverElementsForToggle[0] = document.getElementsByClassName("attr-div " + self.stats.allStats[i])[0];
      hoverElementsForToggle[1] = document.getElementsByClassName("progress-bar " + self.stats.allStats[i])[0];

      // mouseover on hoverElements to toggle active class on current 'mouseover' attribute
      hoverElementsForToggle.forEach(function(element) {
        element.addEventListener("mouseover", function () {
          if (self.stats.allStats[i] != currentActive) {
          document.getElementsByClassName("bonuses " + self.stats.allStats[i])[0].classList.add("active");
          document.getElementsByClassName("bonuses " + currentActive)[0].classList.remove("active");
          currentActive = self.stats.allStats[i];
          }
        });
      });
    });

    loadQueryParams();
    updateQueryParams();

    self.resetAll = resetAll;
    self.resetAttributes = resetAttributes;
    self.resetAttribute = resetAttribute;
    self.increaseLevelTo = increaseLevelTo;
    self.maxOutLevel = maxOutLevel;
    self.levelStatTo = levelStatTo;
    self.maxOutAttribute = maxOutAttribute;
    self.setCurrentExperience = setCurrentExperience;
    self.getAttrCost = getAttrCost;
    self.adjustAttrPoints = adjustAttrPoints;
    self.adjustFeatPoints = adjustFeatPoints;
    self.adjustBonuses = adjustBonuses;
    self.calcPlayerStats = calcPlayerStats;
    self.adjustProgress = adjustProgress;

    self.levelUp = levelUp;
    self.levelDown = levelDown;
    self.statUp = statUp;
    self.statDown = statDown;

    self.loadQueryParams = loadQueryParams;
    self.updateQueryParams = updateQueryParams;

    self.onMouseHold = onMouseHold;
    self.clearMouseHold = clearMouseHold;

    }
  });
