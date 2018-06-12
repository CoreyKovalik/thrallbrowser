angular
  .module('thrallbrowser')
  .component('stats', {
    templateUrl: 'components/stats/stats.template.html',
    controllerAs: 'statsCtrl',
    controller: function statsCalculatorController($scope, $q, $route, $routeParams, $location, statsdata) {
    var self = this;
    self.isLoading = true;
    self.loadingError = false;

    //TO DO: cleanup functions --> increaseLevelTo, levelStatTo [maybe change name to increaseStatTo, or setLevel/setStat]
    //       skim over Increase/Descrease functions for cleanup as well
    //  add weapon/offhand slot
    //  add warpaint data and slots
    //  add armor/weapon tinker items data and options for them
    //  print current character info
    //  Create a sharing box:
    //        Name, ServerID (how to find), Character ID(how to find), race (all options), gender (tickbox), full text-only build sharing

    // **test in-game** test certain weapons and offhand items if you can add smiths to them (i.e. what smithing items on bows)

    //FIX:  weird bug with stat buttons on laptop // only on this branch, possibly some sort of ng-click issue mixed with mousepad
    //maybe:  adjustSlotStatus function?

    function loadData() {

      let armorsPromise = statsdata.getArmorsData();
      let weaponsPromise = statsdata.getWeaponsData();
      let consumablesPromise = statsdata.getConsumablesData();

      $q.all([armorsPromise, weaponsPromise, consumablesPromise])
        .then(function(results) {

          self.armors = results[0];
          self.armorsMap = _.keyBy(self.armors, 'ItemID');
          self.weapons = results[1];
          self.weaponsMap = _.keyBy(self.weapons, 'ItemID');
          self.consumables = results[2];
          self.consumablesMap = _.keyBy(self.consumables, 'ItemID');
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
    //start calc
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
        "total": 0,
        "_10": false,
        "_20": false,
        "_30": false,
        "_40": false,
        "_50": false
      },
      "agility": {
        "value": 0,
        "total": 0,
        "_10": false,
        "_20": false,
        "_30": false,
        "_40": false,
        "_50": false
      },
      "vitality": {
        "value": 0,
        "total": 0,
        "_10": false,
        "_20": false,
        "_30": false,
        "_40": false,
        "_50": false
      },
      "accuracy": {
        "value": 0,
        "total": 0,
        "_10": false,
        "_20": false,
        "_30": false,
        "_40": false,
        "_50": false
      },
      "grit": {
        "value": 0,
        "total": 0,
        "_10": false,
        "_20": false,
        "_30": false,
        "_40": false,
        "_50": false
      },
      "encumbrance": {
        "value": 0,
        "total": 0,
        "_10": false,
        "_20": false,
        "_30": false,
        "_40": false,
        "_50": false
      },
      "survival": {
        "value": 0,
        "total": 0,
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

    self.headSlot         = null;
    self.torsoSlot        = null;
    self.handsSlot        = null;
    self.legsSlot         = null;
    self.feetSlot         = null;
    self.weaponSlot       = null;
    self.offhandSlot      = null;

    self.headSlotSmith    = null;
    self.torsoSlotSmith   = null;
    self.handsSlotSmith   = null;
    self.legsSlotSmith    = null;
    self.feetSlotSmith    = null;
    self.weaponSlotSmith  = null;
    self.offhandSlotSmith = null;

    self.warpaintSlot     = null;

    self.slotStatus = ["<empty slot>", "<disabled> - equip an item", "<disabled> - shields only", "<disabled> - Two-Handed", "<select item enhancement>", "<select a warpaint>", "<equip arrows>"];
    self.unselectedSlot = {
      "headSlot"        : self.slotStatus[0],
      "torsoSlot"       : self.slotStatus[0],
      "handsSlot"       : self.slotStatus[0],
      "legsSlot"        : self.slotStatus[0],
      "feetSlot"        : self.slotStatus[0],
      "weaponSlot"      : self.slotStatus[0],
      "offhandSlot"     : self.slotStatus[0],
      "headSlotSmith"   : self.slotStatus[1],
      "torsoSlotSmith"  : self.slotStatus[1],
      "handsSlotSmith"  : self.slotStatus[1],
      "legsSlotSmith"   : self.slotStatus[1],
      "feetSlotSmith"   : self.slotStatus[1],
      "weaponSlotSmith" : self.slotStatus[1],
      "offhandSlotSmith": self.slotStatus[1],
      "warpaintSlot"    : self.slotStatus[5]
    }

    function toggleSmith(slot) {
      let s = slot.substring(0, slot.length - 5);
      if (self[s] == null) {
        unequipEquipmentSlot(slot);
        self.unselectedSlot[slot] = self.slotStatus[1];
        return;
      }
      if (slot == "offhandSlotSmith") {
          checkShield();
          return;
      }

      if (self[s]) {
        self.unselectedSlot[slot] = self.slotStatus[0];
        return;
      }
    }

    function checkShield() {
      if (self.offhandSlot && self.offhandSlot.Category != "shield")
        self.unselectedSlot.offhandSlotSmith = self.slotStatus[2];
      if (self.offhandSlot && self.offhandSlot.Category == "shield")
        self.unselectedSlot.offhandSlotSmith = self.slotStatus[0];
    }

    function checkTwoHanded() {
      let twoHanded = ["greatsword", "hammer", "daggers", "spear"];
      if (self.weaponSlot == null) {
        self.equipment.twoHanded = false;
        self.unselectedSlot.offhandSlot = self.slotStatus[0];
        self.offhandFilter_category = "";
        if (self.offhandSlot == null)
          self.unselectedSlot.offhandSlotSmith = self.slotStatus[1];
        checkShield();
        return;
      }
      if (self.weaponSlot.Category == "bow") {
        self.equipment.twoHanded = false;
        self.offhandFilter_category = "arrow";
        self.unselectedSlot.offhandSlot = self.slotStatus[6];
        console.log("made it arrow");
        return;
      }
      if (twoHanded.includes(self.weaponSlot.Category)) {
        self.equipment.twoHanded = true;
        unequipEquipmentSlot("offhandSlot");
        unequipEquipmentSlot("offhandSlotSmith");
        self.unselectedSlot.weaponSlotSmith = self.slotStatus[0];
        self.unselectedSlot.offhandSlot = self.slotStatus[3] + ' ' + self.weaponSlot.Category + " Equipped";
        self.unselectedSlot.offhandSlotSmith = self.slotStatus[3];
      }

      else {
        console.log('one handed');
        self.equipment.twoHanded = false;
        self.offhandFilter_category = "";
        self.unselectedSlot.offhandSlot = self.slotStatus[0];
        self.unselectedSlot.offhandSlotSmith = self.slotStatus[1];
      }
    }

    self.equipment = {
      "allArmorBonuses": ["Armor", "Heat", "Cold", "Weight", "Str", "Agi", "Vit", "Acc", "Grit", "Enc", "Sur"],
      "allWeaponBonuses": ["Damage", "Heat", "Cold", "Weight", "Str", "Agi", "Vit", "Acc", "Grit", "Enc", "Sur"],
      "twoHanded": false,
      "damage": 0,
      "armor": 0,
      "armorPenetration": 0,
      "heatResist":0,
      "coldResist":0,
      "weightOfEquipped": 0,
      "strength": 0,
      "agility": 0,
      "vitality": 0,
      "accuracy": 0,
      "grit": 0,
      "encumbrance": 0,
      "survival": 0
    }

    function resetAll() {
      self.stats.strength.value = self.stats.agility.value = self.stats.vitality.value = self.stats.accuracy.value = self.stats.grit.value = self.stats.encumbrance.value = self.stats.survival.value = self.stats.spentPoints = self.stats.availableFeats = 0;
      self.stats.characterLevel = self.stats.unspentPoints = 1;
      self.stats.currentExperience = "0 / 275";
      resetEquipment();
      updateAll();
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
      self.headSlot         = null;
      self.torsoSlot        = null;
      self.handsSlot        = null;
      self.legsSlot         = null;
      self.feetSlot         = null;
      self.weaponSlot       = null;
      self.offhandSlot      = null;
      self.headSlotSmith    = null;
      self.torsoSlotSmith   = null;
      self.handsSlotSmith   = null;
      self.legsSlotSmith    = null;
      self.feetSlotSmith    = null;
      self.weaponSlotSmith  = null;
      self.offhandSlotSmith = null;
      self.warpaintSlot     = null;
      checkTwoHanded();
      toggleSmith("headSlotSmith");
      toggleSmith("torsoSlotSmith");
      toggleSmith("handsSlotSmith");
      toggleSmith("legsSlotSmith");
      toggleSmith("feetSlotSmith");
      toggleSmith("weaponSlotSmith");
      toggleSmith("offhandSlotSmith");
      update();
    }

    function unequipEquipmentSlot(slot) {
      self[slot] = null;
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
        if(!statUp(statName)) {
          console.log("still works!");
          return false;
        }
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
        self.stats[statString].total >= lvl ? self.stats[statString][teir] = true : self.stats[statString][teir] = false;
      }
    }

    function adjustEquipmentBonuses() {
      let items = [self.headSlot, self.torsoSlot, self.handsSlot, self.legsSlot, self.feetSlot, self.weaponSlot, self.offhandSlot,
                  self.headSlotSmith, self.torsoSlotSmith, self.handsSlotSmith, self.legsSlotSmith, self.feetSlotSmith, self.weaponSlotSmith, self.offhandSlotSmith,
                  self.warpaintSlot];

      self.equipment.damage           = _(items).filter().sumBy('Damage');
      self.equipment.armorPenetration = _(items).filter().sumBy('ArmorPenetration');
      self.equipment.armor            = _(items).filter().sumBy('Armor');
      self.equipment.heatResist       = _(items).filter().sumBy('Heat');
      self.equipment.coldResist       = _(items).filter().sumBy('Cold');

      let calculatedWeight = 0;
      for(var i=7; i < 14; i++) {
        if (items[i] != null && items[i].hasOwnProperty('WeightReduction')) {
          calculatedWeight += (items[i - 7].Weight) - (items[i - 7].Weight * items[i].WeightReduction);
        }
        else {
          if(items[i - 7] != null)
            calculatedWeight += items[i - 7].Weight;
        }
      }

      self.equipment.weightOfEquipped = calculatedWeight;
      self.equipment.strength   = _(items).filter().sumBy('Str');
      self.equipment.agility    = _(items).filter().sumBy('Agi');
      self.equipment.vitality   = _(items).filter().sumBy('Vit');
      self.equipment.accuracy   = _(items).filter().sumBy('Acc');
      self.equipment.grit       = _(items).filter().sumBy('Grit');
      self.equipment.encumbrance= _(items).filter().sumBy('Enc');
      self.equipment.survival   = _(items).filter().sumBy('Sur');
    }

    function adjustStatTotals() {
      for (var i = 0; i < 7; i++) {
        self.stats[self.stats.allStats[i]].total = self.stats[self.stats.allStats[i]].value + self.equipment[self.stats.allStats[i]];
      }
    }

    //Math calculations for playerStats based on attributes and certain bonus perks

    function calcPlayerStats() {
      self.stats.playerStats.health.value = (8 * self.stats.vitality.total) + self.stats.playerStats.health.base;
      self.stats.playerStats.stamina.value = (3 * self.stats.grit.total) + self.stats.playerStats.stamina.base;
      self.stats.playerStats.encumbrance.value = (7 * self.stats.encumbrance.total) + self.stats.playerStats.encumbrance.base;
      self.stats.playerStats.melee.value = Math.round((100 * 0.025 * self.stats.strength.total) + self.stats.playerStats.melee.base);
      self.stats.playerStats.ranged.value = Math.round((100 * 0.025 * self.stats.accuracy.total) + self.stats.playerStats.ranged.base);
        if(self.stats.accuracy._30) self.stats.playerStats.ranged.value += 10;
      self.stats.playerStats.armor.value = (2 * self.stats.agility.total) + self.stats.playerStats.armor.base;
        if(self.stats.grit._30) self.stats.playerStats.armor.value += 15;
      self.stats.playerStats.damageResistance.value = precisionRound((self.stats.playerStats.armor.value * 0.003 * 100),1);
        if(self.stats.encumbrance._30) self.stats.playerStats.encumbrance.value += self.stats.playerStats.encumbrance.value * .1;
    }

    function adjustProgress(statString) {
      if (statString == null) return false;

      let statProgress = (self.stats[statString].total / 50) * 100;
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
      adjustStatTotals();
      adjustBonuses(statString);
      calcPlayerStats();
      adjustProgress(statString);
      updateQueryParams();
    }

    function updateAll() {
      for (var i = 0; i < 7; i++) {
        update(self.stats.allStats[i]);
      }
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

    // URL Getter/Setter Functions for sharing character builds
    function loadQueryParams()
    {
      var urlValuesString = $location.search().v;

      if(!urlValuesString || !urlValuesString.split)
        return;

      var urlValuesArray = urlValuesString.split(":");

      function takeID() {
        if (urlValuesArray.length == 0)
          return null;
        else
          return Number(urlValuesArray.shift());
      }

      // 1 character level
      var level = takeID();
      if(level != null)
        increaseLevelTo(level);

      // 7 characters stats
      self.stats.allStats.forEach(function(attribute, i) {
        let statName = self.stats.allStats[i];
        let statTarget = takeID();

        if(statTarget != null)
          levelStatTo(statName, statTarget);
      });

      // 5 armor slots
      let slot1 = takeID();
      if (slot1 != null && self.armorsMap[slot1]) {
        self.headSlot = self.armorsMap[slot1];
        toggleSmith("headSlotSmith");
      }

      let slot2 = takeID();
      if (slot2 != null && self.armorsMap[slot2]) {
        self.torsoSlot = self.armorsMap[slot2];
        toggleSmith("torsoSlotSmith");
      }

      let slot3 = takeID();
      if (slot3 != null && self.armorsMap[slot3]) {
        self.handsSlot = self.armorsMap[slot3];
        toggleSmith("handsSlotSmith");
      }

      let slot4 = takeID();
      if (slot4 != null && self.armorsMap[slot4]) {
        self.legsSlot = self.armorsMap[slot4];
        toggleSmith("legsSlotSmith");
      }

      let slot5 = takeID();
      if (slot5 != null && self.armorsMap[slot5]) {
        self.feetSlot = self.armorsMap[slot5];
        toggleSmith("feetSlotSmith");
      }

      // 2 weapon slots
      let slot6 = takeID();
      if (slot6 != null && self.weaponsMap[slot6]) {
        self.weaponSlot = self.weaponsMap[slot6];
        checkTwoHanded();
        toggleSmith("weaponSlotSmith");
      }

      let slot7 = takeID();
      if (slot7 != null && self.weaponsMap[slot7]) {
        self.offhandSlot = self.weaponsMap[slot7];
        toggleSmith("offhandSlotSmith");
      }

      let slot8 = takeID();
      if (slot8 != null && self.consumablesMap[slot8]) {
        self.headSlotSmith = self.consumablesMap[slot8];
      }

      let slot9 = takeID();
      if (slot9 != null && self.consumablesMap[slot9]) {
        self.torsoSlotSmith = self.consumablesMap[slot9];
      }

      let slot10 = takeID();
      if (slot10 != null && self.consumablesMap[slot10]) {
        self.handsSlotSmith = self.consumablesMap[slot10];
      }

      let slot11 = takeID();
      if (slot11 != null && self.consumablesMap[slot11]) {
        self.legsSlotSmith = self.consumablesMap[slot11];
      }

      let slot12 = takeID();
      if (slot12 != null && self.consumablesMap[slot12]) {
        self.feetSlotSmith = self.consumablesMap[slot12];
      }

      let slot13 = takeID();
      if (slot13 != null && self.consumablesMap[slot13]) {
        self.weaponSlotSmith = self.consumablesMap[slot13];
      }

      let slot14 = takeID();
      if (slot14 != null && self.consumablesMap[slot14]) {
        self.offhandSlotSmith = self.consumablesMap[slot14];
      }

      let slot15 = takeID();
      if (slot15 != null && self.consumablesMap[slot15]) {
        self.warpaintSlot = self.consumablesMap[slot15];
      }
      updateAll();
    }


    function updateQueryParams()
    {
      function setID(slot) {
        if (slot == null)
          return '0';
        else
          return slot.ItemID;
      }

      $location.search('v',
        self.stats.characterLevel     + ':' +
        self.stats.strength.value     + ':' +
        self.stats.agility.value      + ':' +
        self.stats.vitality.value     + ':' +
        self.stats.accuracy.value     + ':' +
        self.stats.grit.value         + ':' +
        self.stats.encumbrance.value  + ':' +
        self.stats.survival.value     + ':' +
        setID(self.headSlot)          + ':' +
        setID(self.torsoSlot)         + ':' +
        setID(self.handsSlot)         + ':' +
        setID(self.legsSlot)          + ':' +
        setID(self.feetSlot)          + ':' +
        setID(self.weaponSlot)        + ':' +
        setID(self.offhandSlot)       + ':' +
        setID(self.headSlotSmith)     + ':' +
        setID(self.torsoSlotSmith)    + ':' +
        setID(self.handsSlotSmith)    + ':' +
        setID(self.legsSlotSmith)     + ':' +
        setID(self.feetSlotSmith)     + ':' +
        setID(self.weaponSlotSmith)   + ':' +
        setID(self.offhandSlotSmith)  + ':' +
        setID(self.warpaintSlot));
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

    // end calc
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

    self.toggleSmith = toggleSmith;
    self.checkTwoHanded = checkTwoHanded;
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

    // filters
    self.offhandFilter_name = "";
    self.offhandFilter_category = "";

    loadData();
    }
  });
