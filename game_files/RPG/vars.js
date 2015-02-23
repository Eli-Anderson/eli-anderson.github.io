var game = {
	playing: false,
	paused: false,
}


var currentMap = worldMap[0][0]
var tileSheet = new Image();
tileSheet.src = 'images/tiles.png'
var entitySheet = new Image();
entitySheet.src = 'images/entities.png'
var loadbutton = new Image();
loadbutton.src = "images/button.png"


var preCanv = document.getElementById('precanvas')
var preCanvCtx = preCanv.getContext('2d')

var enemies = []