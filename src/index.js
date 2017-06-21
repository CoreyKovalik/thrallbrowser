import $ from "jquery";

var charList = [
    {
        name: 'nullsoldier',
        level: 5,
        is_online: false,
        steam_id: 123124352523,
        conan_id: 1,
        last_online: 14322352,
        last_killed_by: null,
        x: 0,
        y: 0,
        z: 0,
    }, {
        name: 'immotal',
        level: 34,
        is_online: true,
        steam_id: 67642313,
        conan_id: 2,
        last_online: 1632200,
        last_killed_by: 1,
        x: 0,
        y: 0,
        z: 0,
    }
];


$(document.body).append('<div id="main"></div>');


$('#main').append('<h1 class="loadbutton"></h1>');
$('.loadbutton').append("Click to load all characters!");

$('#main').append('<div id="allcharacters"></div>');

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


var displayCharacters = function() {

	for(var char in charList) {
	if (charList.hasOwnProperty(char)) {

		//make a div
		$("#allcharacters").append(characterDiv);
		var characterEditLoop = characterStart.replace("%name%", charList[char].name);
		var characterEditLoop = characterEditLoop.replace("%level%", charList[char].level);
		var characterEditLoop = characterEditLoop.replace("%online%", charList[char].is_online);
		var characterEditLoop = characterEditLoop.replace("%steam%", charList[char].steam_id);
		var	characterEditLoop = characterEditLoop.replace("%conan%", charList[char].conan_id);
		var characterEditLoop = characterEditLoop.replace("%lastonline%", charList[char].last_online);
		var characterEditLoop = characterEditLoop.replace("%lastkilled%", charList[char].last_killed_by);
		var characterEditLoop = characterEditLoop.replace("%x%", charList[char].x);
		var characterEditLoop = characterEditLoop.replace("%y%", charList[char].y);
		var characterEditLoop = characterEditLoop.replace("%z%", charList[char].z);

		$(".character:last").append(characterEditLoop);
	}
	}
};

$('.loadbutton').mouseenter(function(){
	$('.loadbutton').css("color", "green");

});

$('.loadbutton').mouseleave(function(){
	$('.loadbutton').css("color", "black");

})


$('.loadbutton').click(displayCharacters);