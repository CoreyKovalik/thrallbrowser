import $ from "jquery";
import superagent from "superagent";

// execute ./build.sh to regenerate

// SAMPLE DATA
    // var characters = [
    //     {
    //         name: 'nullsoldier',
    //         level: 5,
    //         is_online: false,
    //         // steam_id: 123124352523,
    //         // conan_id: 1,
    //         // last_online: 14322352,
    //         // last_killed_by: null,
    //         // x: 0,
    //         // y: 0,
    //         // z: 0,
    //     }, {
    //         name: 'immotal',
    //         level: 34,
    //         is_online: true,
    //         // steam_id: 67642313,
    //         // conan_id: 2,
    //         // last_online: 1632200,
    //         // last_killed_by: 1,
    //         // x: 0,
    //         // y: 0,
    //         // z: 0,
    //     }
    // ]

    function renderTable(characters) {
        var element = document.createElement('table');
        element.appendChild(renderHeader());

        for (var character of characters) {
            element.appendChild(renderCharacterData(character));
        }

        return element;
    }

    function renderHeader() {
        var elementTR = document.createElement('tr');
        var nameTH = document.createElement('th');
        var levelTH = document.createElement('th');
        var onlineTH = document.createElement('th');
        var steamTH = document.createElement('th');
        var conanTH = document.createElement('th');
        var serverTH = document.createElement('th');
        var killedTH = document.createElement('th');
        var xyzTH = document.createElement('th');
        nameTH.innerText = "Name";
        levelTH.innerText = "Level";
        onlineTH.innerText = "Online?";
        steamTH.innerText = "Steam ID";
        conanTH.innerText = "Conan ID";
        serverTH.innerText = "Server ID";
        killedTH.innerText = "Last Killed by";
        xyzTH.innerText = "(X, Y, Z)";
        elementTR.appendChild(nameTH);
        elementTR.appendChild(levelTH);
        elementTR.appendChild(onlineTH);
        elementTR.appendChild(steamTH);
        elementTR.appendChild(conanTH);
        elementTR.appendChild(serverTH);
        elementTR.appendChild(killedTH);
        elementTR.appendChild(xyzTH);

        return elementTR;
    }

    function renderCharacterData(character) {
        var elementTR = document.createElement('tr');
        var nameTD = document.createElement('td');
        var levelTD = document.createElement('td');
        var onlineTD = document.createElement('td');
        var steamTD = document.createElement('td');
        var conanTD = document.createElement('td');
        var serverTD = document.createElement('td');
        var killedTD = document.createElement('td');
        var xyzTD = document.createElement('td');
        nameTD.innerText = character.name;
        levelTD.innerText = character.level;

        if (character.is_online == true) {
            onlineTD.innerText = "Online Now";
        } else {
            onlineTD.innerText = "Last online " + character.last_online;
        }

        steamTD.innerText = character.steam_id;
        conanTD.innerText = character.conan_id;
        serverTD.innerText = character.server_id;
        killedTD.innerText = character.last_killed_by;

        function roundConcatXYZ(x, y, z) {
            var xx = Math.round(x);
            var yy = Math.round(y);
            var zz = Math.round(z);
            var xyz = "(" + xx + ", " + yy + ", " + zz + ")";

            return xyz;
        }

        xyzTD.innerText = roundConcatXYZ(character.x, character.y, character.z);
        elementTR.appendChild(nameTD);
        elementTR.appendChild(levelTD);
        elementTR.appendChild(onlineTD);
        elementTR.appendChild(steamTD);
        elementTR.appendChild(conanTD);
        elementTR.appendChild(serverTD);
        elementTR.appendChild(killedTD);
        elementTR.appendChild(xyzTD);

        return elementTR;
    }


    superagent.get("https://serverthrallapi.herokuapp.com/api/2/characters?private_secret=200cd768-5b1d-11e7-9e82-d60626067254").end(function(err, res){

        var characterTable = renderTable(res.body);
        document.body.appendChild(characterTable);
    });