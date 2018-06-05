angular
  .module('thrallbrowser')
  .component('stats', {
    templateUrl: 'components/stats/stats.template.html',
    controllerAs: 'statsCtrl',
    controller: function statsCalculatorController($scope, $q, $route, $routeParams, $location, statsdata) {
    var self = this;
    self.isLoading = true;
    self.loadingError = false;

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
    //end conan-image-preloader
    //start conan-stat-data

    function loadData() {

      let armorsPromise = statsdata.getArmorsData();

      let weaponsPromise = statsdata.getWeaponsData();

      $q.all([armorsPromise, weaponsPromise])
        .then(function(results) {

          self.armors = results[0];
          self.armorsMap = _.keyBy(self.armors, 'ItemID');
          self.weapons = results[1];
          self.weaponsMap = _.keyBy(self.weapons, 'ItemID');
          self.isLoading = false;
          self.loadingError = false;
          addLoadEvent(preloader);
          createMouseOvers();
          loadQueryParams();
          updateQueryParams();
        })
        .catch(function(respone) {
          self.isLoading = false;
          self.loadingError = true;
        });

    }


    self.EXP_ARRAY = [0,275,1325,3675,7825,14325,23675,36400,53000,74000,99925,131300,168625,212450,263275,321600,387975,462900,546900,640475,744175,858500,983975,1121100,1270400,1432400,1607625,1796600,1999825,2217825,2451125,2700225,2965650,3247925,3547575,3865100,4201025,4555875,4930175,5324425,5739150,6174875,6632125,7111400,7613225,8138125,8686600,9259175,9856375,10478725,11126725,11800925,12501825,13229925,13985775,14769875,15582750,16424900,17296850,18199150,19132275];

    self.equipment = {
      "allArmorBonuses": ["Armor", "Heat", "Cold", "Weight", "Str", "Agi", "Vit", "Acc", "Grit", "Enc", "Sur"],
      "allWeaponBonuses": ["Damage", "Heat", "Cold", "Weight", "Str", "Agi", "Vit", "Acc", "Grit", "Enc", "Sur"],
      "damage": 0,
      "armor": 0,
      "heatResist":0,
      "coldResist":0,
      "weightOfEquipped": 0,
      "strBonus": 0,
      "agiBonus": 0,
      "vitBonus": 0,
      "accBonus": 0,
      "gritBonus": 0,
      "encBonus": 0,
      "surBonus": 0
    }

    self.equipped = {
      "head": 0,
      "torso": 0,
      "hands": 0,
      "legs": 0,
      "feet": 0
    }

    self.headSlot  = {ItemID: 0, Armor: 0, Heat: 0, Cold: 0, Weight: 0, Str: 0, Agi: 0, Vit: 0, Acc: 0, Grit: 0, Enc: 0, Sur:0};
    self.torsoSlot = {ItemID: 0, Armor: 0, Heat: 0, Cold: 0, Weight: 0, Str: 0, Agi: 0, Vit: 0, Acc: 0, Grit: 0, Enc: 0, Sur:0};
    self.handsSlot = {ItemID: 0, Armor: 0, Heat: 0, Cold: 0, Weight: 0, Str: 0, Agi: 0, Vit: 0, Acc: 0, Grit: 0, Enc: 0, Sur:0};
    self.legsSlot  = {ItemID: 0, Armor: 0, Heat: 0, Cold: 0, Weight: 0, Str: 0, Agi: 0, Vit: 0, Acc: 0, Grit: 0, Enc: 0, Sur:0};
    self.feetSlot  = {ItemID: 0, Armor: 0, Heat: 0, Cold: 0, Weight: 0, Str: 0, Agi: 0, Vit: 0, Acc: 0, Grit: 0, Enc: 0, Sur:0};

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
      resetEquipment();
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

    function resetEquipment() {
      self.headSlot  = {ItemID: 0, Armor: 0, Heat: 0, Cold: 0, Weight: 0, Str: 0, Agi: 0, Vit: 0, Acc: 0, Grit: 0, Enc: 0, Sur:0};
      self.torsoSlot = {ItemID: 0, Armor: 0, Heat: 0, Cold: 0, Weight: 0, Str: 0, Agi: 0, Vit: 0, Acc: 0, Grit: 0, Enc: 0, Sur:0};
      self.handsSlot = {ItemID: 0, Armor: 0, Heat: 0, Cold: 0, Weight: 0, Str: 0, Agi: 0, Vit: 0, Acc: 0, Grit: 0, Enc: 0, Sur:0};
      self.legsSlot  = {ItemID: 0, Armor: 0, Heat: 0, Cold: 0, Weight: 0, Str: 0, Agi: 0, Vit: 0, Acc: 0, Grit: 0, Enc: 0, Sur:0};
      self.feetSlot  = {ItemID: 0, Armor: 0, Heat: 0, Cold: 0, Weight: 0, Str: 0, Agi: 0, Vit: 0, Acc: 0, Grit: 0, Enc: 0, Sur:0};
      update();
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

    function adjustEquipmentBonuses() {
      console.log('adjustEquipmentBonuses() runs');
      let armor = 0;
      let heat = 0;
      let cold = 0;
      let weight = 0;
      let str = 0;
      let agi = 0;
      let vit = 0;
      let acc = 0;
      let grit = 0;
      let enc = 0;
      let sur = 0;

      let head = 0;
      let torso = 0;
      let hands = 0;
      let legs = 0;
      let feet = 0;

      head = self.headSlot.ItemID;
      torso = self.torsoSlot.ItemID;
      hands = self.handsSlot.ItemID;
      legs = self.legsSlot.ItemID;
      feet = self.feetSlot.ItemID;

      console.log(head);
      console.log(torso);
      console.log(hands);
      console.log(legs);
      console.log(feet);

      self.equipped.head = head;
      self.equipped.torso = torso;
      self.equipped.hands = hands;
      self.equipped.legs = legs;
      self.equipped.feet = feet;

      armor = (self.headSlot.Armor   +
            self.torsoSlot.Armor     +
            self.handsSlot.Armor     +
            self.legsSlot.Armor      +
            self.feetSlot.Armor);

      heat = (self.headSlot.Heat     +
            self.torsoSlot.Heat      +
            self.handsSlot.Heat      +
            self.legsSlot.Heat       +
            self.feetSlot.Heat);

      cold = (self.headSlot.Cold     +
            self.torsoSlot.Cold      +
            self.handsSlot.Cold      +
            self.legsSlot.Cold       +
            self.feetSlot.Cold);

      weight = (self.headSlot.Weight +
            self.torsoSlot.Weight    +
            self.handsSlot.Weight    +
            self.legsSlot.Weight     +
            self.feetSlot.Weight);

      str = (self.headSlot.Str       +
            self.torsoSlot.Str       +
            self.handsSlot.Str       +
            self.legsSlot.Str        +
            self.feetSlot.Str);

      agi = (self.headSlot.Agi       +
            self.torsoSlot.Agi       +
            self.handsSlot.Agi       +
            self.legsSlot.Agi        +
            self.feetSlot.Agi);

      vit = (self.headSlot.Vit       +
            self.torsoSlot.Vit       +
            self.handsSlot.Vit       +
            self.legsSlot.Vit        +
            self.feetSlot.Vit);

      acc = (self.headSlot.Acc       +
            self.torsoSlot.Acc       +
            self.handsSlot.Acc       +
            self.legsSlot.Acc        +
            self.feetSlot.Acc);

      grit = (self.headSlot.Grit     +
            self.torsoSlot.Grit      +
            self.handsSlot.Grit      +
            self.legsSlot.Grit       +
            self.feetSlot.Grit);

      enc = (self.headSlot.Enc       +
            self.torsoSlot.Enc       +
            self.handsSlot.Enc       +
            self.legsSlot.Enc        +
            self.feetSlot.Enc);

      sur = (self.headSlot.Sur       +
            self.torsoSlot.Sur       +
            self.handsSlot.Sur       +
            self.legsSlot.Sur        +
            self.feetSlot.Sur);

      self.equipment.armor            = armor;
      self.equipment.heatResist       = heat;
      self.equipment.coldResist       = cold;
      self.equipment.weightOfEquipped = weight;
      self.equipment.strBonus         = str;
      self.equipment.agiBonus         = agi;
      self.equipment.vitBonus         = vit;
      self.equipment.accBonus         = acc;
      self.equipment.gritBonus        = grit;
      self.equipment.encBonus         = enc;
      self.equipment.surBonus         = sur;
      console.log('adjustEquipmentBonuses() finished');
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
      adjustEquipmentBonuses();
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
      var urlValuesString = $location.search().v;

      if(!urlValuesString || !urlValuesString.split)
        return;

      var urlValuesArray = urlValuesString.split(":");

      function takeStat() {
        if (urlValuesArray.length == 0)
          return null;
        else
          return Number(urlValuesArray.shift());
      }

      //character level
      var level = takeStat();
      if(level != null)
        increaseLevelTo(level);

      // 7 characters stats
      self.stats.allStats.forEach(function(attribute, i) {
        let statName = self.stats.allStats[i];
        let statTarget = takeStat();

        if(statTarget != null)
          levelStatTo(statName, statTarget);
      });

      //5 armor slots
      let slot1 = takeStat();
      if (slot1 != null && self.armorsMap[slot1])
        self.headSlot = self.armorsMap[slot1];

      let slot2 = takeStat();
      if (slot2 != null && self.armorsMap[slot2])
        self.torsoSlot = self.armorsMap[slot2];

      let slot3 = takeStat();
      if (slot3 != null && self.armorsMap[slot3])
        self.handsSlot = self.armorsMap[slot3];

      let slot4 = takeStat();
      if (slot4 != null && self.armorsMap[slot4])
        self.legsSlot = self.armorsMap[slot4];

      let slot5 = takeStat();
      if (slot5 != null && self.armorsMap[slot5])
        self.feetSlot = self.armorsMap[slot5];
    }


    function updateQueryParams()
    {
      $location.search('v',
        self.stats.characterLevel     + ':' +
        self.stats.strength.value     + ':' +
        self.stats.agility.value      + ':' +
        self.stats.vitality.value     + ':' +
        self.stats.accuracy.value     + ':' +
        self.stats.grit.value         + ':' +
        self.stats.encumbrance.value  + ':' +
        self.stats.survival.value     + ':' +
        self.equipped.head            + ':' +
        self.equipped.torso           + ':' +
        self.equipped.hands           + ':' +
        self.equipped.legs            + ':' +
        self.equipped.feet);
    }

    // Helper Functions //

    let mouseHoldInterval = 0;

    function onMouseHold(func, statString, event) {
      if (event.which == 3) {
        clearInterval(mouseHoldInterval);
        return;
      }
      if (event.which == 1)
      {
        mouseHoldInterval = setInterval(function() {
          if (statString)
            func(statString);
          else
            func();

          $scope.$digest();

        }, 140);
      }
    }

    function clearMouseHold(event) {
      clearInterval(mouseHoldInterval);
    }

    function precisionRound(number, precision) {
      var factor = Math.pow(10, precision);
      return Math.round(number * factor) / factor;
    }

    let currentActive = "strength";

    function createMouseOvers() {
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
    }

    self.resetAll = resetAll;
    self.resetAttributes = resetAttributes;
    self.resetAttribute = resetAttribute;
    self.resetEquipment = resetEquipment;
    self.increaseLevelTo = increaseLevelTo;
    self.maxOutLevel = maxOutLevel;
    self.levelStatTo = levelStatTo;
    self.maxOutAttribute = maxOutAttribute;
    self.setCurrentExperience = setCurrentExperience;
    self.getAttrCost = getAttrCost;
    self.adjustAttrPoints = adjustAttrPoints;
    self.adjustFeatPoints = adjustFeatPoints;
    self.adjustBonuses = adjustBonuses;
    self.adjustEquipmentBonuses = adjustEquipmentBonuses;
    self.calcPlayerStats = calcPlayerStats;
    self.adjustProgress = adjustProgress;

    self.levelUp = levelUp;
    self.levelDown = levelDown;
    self.statUp = statUp;
    self.statDown = statDown;

    self.update = update;
    self.loadQueryParams = loadQueryParams;
    self.updateQueryParams = updateQueryParams;

    self.onMouseHold = onMouseHold;
    self.clearMouseHold = clearMouseHold;

    loadData();
    }
  });
