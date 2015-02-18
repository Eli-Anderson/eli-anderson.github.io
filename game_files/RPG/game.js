var playersprite = tile_grass
var player = {
	currentSprite: playersprite,
	currentSpriteX: 0,
	spriteWidth: 16,
	movingRight: false,
	x: 100,
	y: 100,
}
var tick = 0;
var frame = 0;

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
	ctx.fillRect(player.x,player.y,64,64)
	//ctx.drawImage(player.currentSprite,player.x,player.y)
}

function animatePlayer(){
	if (player.walking){
		if(player.movingRight){
			player.x += 2;
			if(frame % 2 == 0){
				player.currentSpriteX = 1*player.spriteWidth
			}
			else{
				player.currentSpriteX = 2*player.spriteWidth
			}
		}
	}
	else{player.currentSpriteX = 0}
}

function game_init(){
	game.playing = true;
	gameLoop();
}

function gameLoop(){
	tick += 1
	if(tick % 16 == 0){frame ++}
	ctx.clearRect(0,0,480,480)
	ctx.fillStyle='#c79a33'
	ctx.fillRect(0,0,480,480)
	
	animatePlayer()
	drawTiles()
	drawPlayer()
	ctx.font = '20px Georgia'
	ctx.fillText(frame,100,100)
	requestAnimationFrame(gameLoop)
}

document.addEventListener('keydown',keyDown,false)
document.addEventListener('keyup',keyUp,false)
function keyDown(e){
	console.log('key pressed')
	if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40){
		player.moving = true;
		if(e.keyCode == 39){player.movingRight = true;}
	}
}
function keyUp(e){
	console.log('key up')
	if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40){
		player.moving = false;
		if(e.keyCode == 39){player.movingRight = false;}
	}
}
