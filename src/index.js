import $ from "jquery";
import superagent from "superagent";

//execute ./build.sh to regenerate

//sample data below

//create structure on the DOM

$(document.body).append('<div id="main"></div>');

$('#main').append('<h1 class="loadbutton"></h1>');
$('.loadbutton').append("Click to load all characters!");

$('#main').append('<div id="allcharacters"></div>');

//characterDiv allows a starting point to wrap characterStart's data which will be printed

var characterDiv = $('#allcharacters').append('<div class="character"></div>');
var characterStart = '\
<p>Character Name is: <b>%name%</b><br>\
Level is: <b>%level%</b><br>\
Player Online?: <b>%online%</b><br>\
Steam ID: <b>%steam%</b><br>\
Conan ID: <b>%conan%</b><br>\
Last Online: <b>%lastonline%</b><br>\
Last Killed by: <b>%lastkilled%</b><br>\
X-coord: <b>%x%</b><br>\
Y-coord: <b>%y%</b><br>\
Z-coord: <b>%z%</b></p>';

//function for looping through charList and pulling out data from the JSON object

var displayCharacters = function(charList) {

	for(var char in charList) {
	if (charList.hasOwnProperty(char)) {

		//make a div
		$("#allcharacters").append(characterDiv);
		var characterEditLoop = characterStart.replace("%name%", charList[char].name);
		characterEditLoop = characterEditLoop.replace("%level%", charList[char].level);
		characterEditLoop = characterEditLoop.replace("%online%", charList[char].is_online);
		characterEditLoop = characterEditLoop.replace("%steam%", charList[char].steam_id);
		characterEditLoop = characterEditLoop.replace("%conan%", charList[char].conan_id);
		characterEditLoop = characterEditLoop.replace("%lastonline%", charList[char].last_online);
		characterEditLoop = characterEditLoop.replace("%lastkilled%", charList[char].last_killed_by_id);
		characterEditLoop = characterEditLoop.replace("%x%", charList[char].x);
		characterEditLoop = characterEditLoop.replace("%y%", charList[char].y);
		characterEditLoop = characterEditLoop.replace("%z%", charList[char].z);

        var characterFinish;
        characterFinish = characterEditLoop;

        //potentially create new var = characterFinish to store finished loop

		$(".character:last").append(characterFinish);
	}
	}
};

//Ultra-Fancy functionality

$('.loadbutton').mouseenter(function(){
	$('.loadbutton').css("color", "green");
});

$('.loadbutton').mouseleave(function(){
	$('.loadbutton').css("color", "black");
})

$('.loadbutton').click(function(){
    // displayCharacters([
    //     {
    //         name: 'nullsoldier',
    //         level: 5,
    //         is_online: false,
    //         steam_id: 123124352523,
    //         conan_id: 1,
    //         last_online: 14322352,
    //         last_killed_by: null,
    //         x: 0,
    //         y: 0,
    //         z: 0,
    //     }, {
    //         name: 'immotal',
    //         level: 34,
    //         is_online: true,
    //         steam_id: 67642313,
    //         conan_id: 2,
    //         last_online: 1632200,
    //         last_killed_by: 1,
    //         x: 0,
    //         y: 0,
    //         z: 0,
    //     }
    // ]);

    superagent.get("https://serverthrallapi.herokuapp.com/api/1/characters").end(function(err, res){
        displayCharacters(res.body);
    });
});