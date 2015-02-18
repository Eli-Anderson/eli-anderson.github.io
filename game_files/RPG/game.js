
function loadGame(){
	game_init()
}

function drawTiles(){
	for (var i=0;i<currentMap.length;i++){
		for (var j=0;j<currentMap[i].length;j++){
			switch(currentMap[i][j]){
				case 0:
					ctx.drawImage(tile_grass,(j*48),(i*48),48,48);
					break;
			}
		}
	}
}

function drawPlayer(){
	
}

function game_init(){
	game.playing = true;
	gameLoop();
}

function gameLoop(){
	ctx.clearRect(0,0,480,480)
	ctx.fillStyle='#c79a33'
	ctx.fillRect(0,0,480,480)
	drawTiles()
	requestAnimationFrame(gameLoop)
}