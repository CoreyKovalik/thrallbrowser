angular
  .module('thrallbrowser')
  .component('stats', {
    templateUrl: 'components/stats/stats.template.html',
    controllerAs: 'statsCtrl',
    controller: function statsCalculatorController($q, $route, $routeParams) {
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

    //end conan-image-preloader.js
    //start conan-stat-data.js

    const EXP_ARRAY = [0,275,1325,3675,7825,14325,23675,36400,53000,74000,99925,131300,168625,212450,263275,321600,387975,462900,546900,640475,744175,858500,983975,1121100,1270400,1432400,1607625,1796600,1999825,2217825,2451125,2700225,2965650,3247925,3547575,3865100,4201025,4555875,4930175,5324425,5739150,6174875,6632125,7111400,7613225,8138125,8686600,9259175,9856375,10478725,11126725,11800925,12501825,13229925,13985775,14769875,15582750,16424900,17296850,18199150,19132275];

    var stats = {
      "characterLevel": 1,
      "unspentPoints": 1,
      "spentPoints": 0,
      "lifetimePoints": 1,
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
      stats.strength.value = stats.agility.value = stats.vitality.value = stats.accuracy.value = stats.grit.value = stats.encumbrance.value = stats.survival.value = stats.spentPoints = stats.availableFeats = 0;
      stats.characterLevel = stats.unspentPoints = stats.lifetimePoints = 1;
      stats.currentExperience = "0 / 275";
      stats.playerStats.health.value = stats.playerStats.health.base;
      stats.playerStats.stamina.value = stats.playerStats.melee.value = stats.playerStats.ranged.value = stats.playerStats.stamina.base;
      stats.playerStats.encumbrance.value = stats.playerStats.encumbrance.base;
      stats.playerStats.armor.value = stats.playerStats.damageResistance.value = stats.playerStats.armor.base;
      for (var i = 0; i < 7; i++) {
        update(stats.allStats[i]);
      }
    }

    function resetAttributes() {
      stats.allStats.forEach(function(attribute) {
        resetAttribute(attribute);
      });
    }

    function resetAttribute(attribute) {
      while (stats[attribute].value > 0) {
        statDown(attribute);
      }
    }

    function maxOutLevel() {
      while (stats.characterLevel < 60) {
        levelUp();
      }
    }

    function maxOutAttribute(attribute) {
      while (stats[attribute].value < 50) {
        if (getAttrCost(stats[attribute].value) > stats.unspentPoints) return false;
        statUp(attribute);
      }
    }

    function setCurrentExperience(currentlevel) {
      stats.currentExperience = EXP_ARRAY[currentlevel - 1].toLocaleString() + " / " + EXP_ARRAY[currentlevel].toLocaleString();
      return EXP_ARRAY[currentlevel -1];
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
        stats[statString].value >= lvl ? stats[statString][teir] = true : stats[statString][teir] = false;
      }
    }

    //Math calculations for playerStats based on attributes and certain bonus perks

    function calcPlayerStats() {
      stats.playerStats.health.value = (8 * stats.vitality.value) + stats.playerStats.health.base;
      stats.playerStats.stamina.value = (3 * stats.grit.value) + stats.playerStats.stamina.base;
      stats.playerStats.encumbrance.value = (7 * stats.encumbrance.value) + stats.playerStats.encumbrance.base;
      stats.playerStats.melee.value = (100 * 0.025 * stats.strength.value) + stats.playerStats.melee.base;
      stats.playerStats.ranged.value = (100 * 0.025 * stats.accuracy.value) + stats.playerStats.ranged.base;
        if(stats.accuracy._30) stats.playerStats.ranged.value += 10;
      stats.playerStats.armor.value = (2 * stats.agility.value) + stats.playerStats.armor.base;
        if(stats.grit._30) stats.playerStats.armor.value += 15;
      stats.playerStats.damageResistance.value = stats.playerStats.armor.value * 0.003 * 100;
        if(stats.encumbrance._30) stats.playerStats.encumbrance.value += stats.playerStats.encumbrance.value * .1;
    }

    function adjustProgress(statString) {
      if (statString == null) return false;

      let statProgress = (stats[statString].value / 50) * 100;
      document.getElementsByClassName("progress " + statString)[0].setAttribute("style", "width:" + statProgress + "%;");

      for (var i = 1; i <= 5; i++) {
        let teir = "_" + i + "0";
        if (stats[statString][teir]) {
          document.getElementsByClassName("progress-bar " + statString)[0].classList.add("perk-" + i);
          document.getElementsByClassName("bonus-icon bonus-teir" + i + " " + statString)[0].setAttribute("src", "./images/t" + i + "-glow.png");
        }
        else {
          document.getElementsByClassName("progress-bar " + statString)[0].classList.remove("perk-" + i);
          document.getElementsByClassName("bonus-icon bonus-teir" + i + " " + statString)[0].setAttribute("src", "./images/t" + i + ".png");
        }
      }
    }

    //end conan-stat-data.js
    //start conan-stat-calc.js

    // Initial Points //
    let characterLevel_html    = document.getElementsByClassName("character-level")[0];
    let unspentPoints_html     = document.getElementsByClassName("unspent-points")[0];
    let currentExperience_html = document.getElementsByClassName("current-experience")[0];
    let strength_html          = document.getElementsByClassName("strength current-level")[0];
    let agility_html           = document.getElementsByClassName("agility current-level")[0];
    let vitality_html          = document.getElementsByClassName("vitality current-level")[0];
    let accuracy_html          = document.getElementsByClassName("accuracy current-level")[0];
    let grit_html              = document.getElementsByClassName("grit current-level")[0];
    let encumbrance_html       = document.getElementsByClassName("encumbrance current-level")[0];
    let survival_html          = document.getElementsByClassName("survival current-level")[0];
    adjustPoints();

    // Initial playerStats //
    let health_html              = document.getElementsByClassName("health")[0];
    let stamina_html             = document.getElementsByClassName("stamina")[0];
    let encumbrance_heading_html = document.getElementsByClassName("encumbrance-heading")[0];
    let encumbrance_player_html  = document.getElementsByClassName("encumbrance-player")[0];
    let melee_html               = document.getElementsByClassName("melee")[0];
    let ranged_html              = document.getElementsByClassName("ranged")[0];
    let armor_html               = document.getElementsByClassName("armor")[0];
    let dmg_resist_html          = document.getElementsByClassName("dmg-resist")[0];
    adjustPlayerStats();

    // Update & adjustment functions //
    function update(statString) {
      adjustPoints();
      adjustBonuses(statString);
      calcPlayerStats();
      adjustPlayerStats();
      adjustProgress(statString);
    }

    function adjustPoints() {
      stats.lifetimePoints             = stats.unspentPoints + stats.spentPoints;

      characterLevel_html.innerText    = stats.characterLevel;
      unspentPoints_html.innerText     = stats.unspentPoints;
      currentExperience_html.innerText = stats.currentExperience;
      strength_html.innerText          = stats.strength.value;
      agility_html.innerText           = stats.agility.value;
      vitality_html.innerText          = stats.vitality.value;
      accuracy_html.innerText          = stats.accuracy.value;
      grit_html.innerText              = stats.grit.value;
      encumbrance_html.innerText       = stats.encumbrance.value;
      survival_html.innerText          = stats.survival.value;
    }

    function adjustPlayerStats() {
      health_html.innerText              = stats.playerStats.health.value;
      stamina_html.innerText             = stats.playerStats.stamina.value;
      encumbrance_heading_html.innerText = stats.playerStats.encumbrance.value;
      encumbrance_player_html.innerText  = stats.playerStats.encumbrance.value;
      melee_html.innerText               = Math.round(stats.playerStats.melee.value) + "%";
      ranged_html.innerText              = Math.round(stats.playerStats.ranged.value) + "%";
      armor_html.innerText               = stats.playerStats.armor.value;
      dmg_resist_html.innerText          = precisionRound(stats.playerStats.damageResistance.value, 1) + "%";
    }

    // Increase/Decrease stat functions
    function levelUp() {
      if (stats.characterLevel == 60) return false;
      stats.characterLevel += 1;
      setCurrentExperience(stats.characterLevel);
      stats.unspentPoints += adjustAttrPoints(stats.characterLevel);
      stats.availableFeats += adjustFeatPoints(stats.characterLevel);
      update();
      console.log("Level Up!");
    }

    function levelDown() {
      if (stats.characterLevel == 1) return false;
      if (stats.characterLevel == 60) {
        document.getElementsByClassName("level-up")[0].disabled = false;
        document.getElementsByClassName("max-level")[0].disabled = false;
      }
      if (stats.unspentPoints < adjustAttrPoints(stats.characterLevel)) {
        return alert("You must first remove attributes before leveling down your Exile.  You cannot remove what you've already spent!");
      }
      stats.unspentPoints -= adjustAttrPoints(stats.characterLevel);
      stats.availableFeats -= adjustFeatPoints(stats.characterLevel);
      stats.characterLevel -= 1;
      setCurrentExperience(stats.characterLevel);
      update();
      console.log("Level Down :(");
    }

    function statUp(statString) {
      let stat = stats[statString].value;
      let name = capitalizeFirst(statString);
      let cost = getAttrCost(stat);
      if (stat == 50)
        return false;
      if (cost > stats.unspentPoints)
        return false;

      stat += 1;
      stats.unspentPoints -= cost;
      stats.spentPoints += cost;
      stats[statString].value = stat;
      update(statString);
      console.log(name + " Up!");
    }

    function statDown(statString) {
      let stat = stats[statString].value;
      if (stat == 0) return false;

      stat -= 1;
      let name = capitalizeFirst(statString);
      let cost = getAttrCost(stat);
      stats.unspentPoints += cost;
      stats.spentPoints -= cost;
      stats[statString].value = stat;
      update(statString);
      console.log(name + " down :(");
    }

    // Helper Functions //

    let mouseHoldInterval = 0;

    function mouseHold(level) {
      mouseHoldInterval = setInterval(level, 120);
    }

    function mouseHoldStatUp(statString) {
      mouseHoldInterval = setInterval(function() {statUp(statString);}, 120);
    }

    function mouseHoldStatDown(statString) {
      mouseHoldInterval = setInterval(function() {statDown(statString);}, 120);
    }

    function mouseReleaseStat() {
      clearInterval(mouseHoldInterval);
    }

    function capitalizeFirst(string) {
      return string.charAt(0).toUpperCase() + string.substr(1);
    }

    function precisionRound(number, precision) {
      var factor = Math.pow(10, precision);
      return Math.round(number * factor) / factor;
    }


    // Apply mouseup/mouseleave event listeners to all stat buttons
    // that clear the mouseHoldInterval for modifying stats

    let statButtons = document.getElementsByClassName("stat-button");

    for (var i = 0; i < statButtons.length; i++) {
      statButtons[i].addEventListener("mouseup", mouseReleaseStat);
      statButtons[i].addEventListener("mouseleave", mouseReleaseStat);
    }

    var levelUp_html   = document.getElementsByClassName("level-up")[0];
    var levelDown_html = document.getElementsByClassName("level-down")[0];

    function createLevelButton(element, buttonFunc) {
      element.addEventListener("click", buttonFunc);
      element.addEventListener("mousedown", mouseHold.bind(null, buttonFunc));
    }

    createLevelButton(levelUp_html, levelUp);
    createLevelButton(levelDown_html, levelDown);

    document.getElementsByClassName("max-level")[0].addEventListener("click", function() {
      maxOutLevel();
    });

    //Reset buttons - all points and levels reverted to base values  +function createStatButtons(stat) {
    document.getElementsByClassName("reset-all")[0].addEventListener("click", resetAll);
    document.getElementsByClassName("reset-attributes")[0].addEventListener("click", resetAttributes);

    function createStatButtons(stat) {
      document.getElementsByClassName(stat + "-up")[0].addEventListener("click", statUp.bind(null, stat));
      document.getElementsByClassName(stat + "-up")[0].addEventListener("mousedown", mouseHoldStatUp.bind(null, stat));
      document.getElementsByClassName(stat + "-down")[0].addEventListener("click", statDown.bind(null, stat));
      document.getElementsByClassName(stat + "-down")[0].addEventListener("mousedown", mouseHoldStatDown.bind(null, stat));
    }

    let currentActive = "strength";

    stats.allStats.forEach(function(attribute, i) {
      createStatButtons(attribute);

      document.getElementsByClassName("reset-attribute")[i].addEventListener("click", function() {
        resetAttribute(stats.allStats[i]);
      });
      document.getElementsByClassName("max-attribute")[i].addEventListener("click", function() {
        maxOutAttribute(stats.allStats[i]);
      });

      //cache attr-div & progress-bar for each attribute. then,
      let hoverElementsForToggle = [];
      hoverElementsForToggle[0] = document.getElementsByClassName("attr-div " + stats.allStats[i])[0];
      hoverElementsForToggle[1] = document.getElementsByClassName("progress-bar " + stats.allStats[i])[0];

      // mouseover on hoverElements to toggle active class on current 'mouseover' attribute
      hoverElementsForToggle.forEach(function(element) {
        element.addEventListener("mouseover", function () {
          if (stats.allStats[i] != currentActive) {
          document.getElementsByClassName("bonuses " + stats.allStats[i])[0].classList.add("active");
          document.getElementsByClassName("bonuses " + currentActive)[0].classList.remove("active");
          currentActive = stats.allStats[i];
          }
        });
      });

    });

//end conan-stat-calc.js
//end calc
    }
  });