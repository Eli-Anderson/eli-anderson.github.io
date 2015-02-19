var playersprite = new Image();
playersprite.src = 'images/player.png'
var player = {
	currentSprite: playersprite,
	currentSpriteX: 0,
	spriteWidth: 16,
	walking: false,
	movingRight: false,
    movingLeft: false,
    movingUp: false,
    movingDown: false,
	x: 0,
	y: 0,
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
	ctx.drawImage(player.currentSprite,player.currentSpriteX,0,player.spriteWidth,16,player.x,player.y,48,48)
}

function animatePlayer(){
	if (player.walking){
		if(player.movingRight && !checkCollision('right')){
			player.x += 2;
			if(frame % 2 == 0){
				player.currentSpriteX = 0*player.spriteWidth
			}
			else{
				player.currentSpriteX = 1*player.spriteWidth
			}
		}
        else if(player.movingLeft && !checkCollision('left')){
			player.x -= 2;
			if(frame % 2 == 0){
				player.currentSpriteX = 2*player.spriteWidth
			}
			else{
				player.currentSpriteX = 3*player.spriteWidth
			}
		}
        if(player.movingUp && !checkCollision('up')){
			player.y -= 2;
			if(frame % 2 == 0){
				player.currentSpriteX = 4*player.spriteWidth
			}
			else{
				player.currentSpriteX = 5*player.spriteWidth
			}
		}
        else if(player.movingDown && !checkCollision('down')){
			player.y += 2;
			if(frame % 2 == 0){
				player.currentSpriteX = 6*player.spriteWidth
			}
			else{
				player.currentSpriteX = 7*player.spriteWidth
			}
		}
	}
	else{
		var v = player.currentSpriteX;
        if(v == 1*player.spriteWidth || v == 3*player.spriteWidth || v == 5*player.spriteWidth || v == 7*player.spriteWidth){player.currentSpriteX -= player.spriteWidth}
        if(player.x % 48 != 0){
            if(player.x % 48 >= 25){player.x += (player.x % 48)/6}
            else{player.x -= (player.x % 48)/6}
        }
        if(player.y % 48 != 0){
            if(player.y % 48 >= 25){player.y += (player.y % 48)/6}
            else{player.y -= (player.y % 48)/6}
        }
        
    }
}

function checkCollision(direction){
	// player.x / 48 = x coordinate
	// player.y / 48 = y coordinate
	
	var x = Math.round(player.x/48)
	var y = Math.round(player.y/48)
	
	//console.log(currentMap[y][x])
	switch (direction){
		case 'right':
			if(currentMap[y][x+1] != 0){return true}
			break;
		case 'left':
			if(currentMap[y][x-1] != 0){return true}
			break;
		case 'up':
			if(currentMap[y-1][x] != 0){return true}
			break;
		case 'down':
			if(currentMap[y+1][x] != 0){return true}
			break;
	}
}

function game_init(){
	game.playing = true;
	gameLoop();
}

function gameLoop(){
	tick += 1;
	animatePlayer()
	if(tick % 16 == 0){frame ++}
	ctx.clearRect(0,0,480,480)
	ctx.fillStyle='#c79a33'
	ctx.fillRect(0,0,480,480)
	checkCollision()
	drawTiles()
	drawPlayer()
	requestAnimationFrame(gameLoop)
}

document.addEventListener('keydown',keyDown,false)
document.addEventListener('keyup',keyUp,false)
function keyDown(e){
	//console.log('key pressed')
	if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40){
		player.walking = true;
		if(e.keyCode == 39){
			player.movingRight = true;
		}
        else if(e.keyCode == 37){
			player.movingLeft = true;
		}
        if(e.keyCode == 38){
			player.movingUp = true;
		}
        else if(e.keyCode == 40){
			player.movingDown = true;
		}
	}
}
function keyUp(e){
	//console.log('key up')
	if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40){
		player.walking = false;
		if(e.keyCode == 39){player.movingRight = false;}
        else if(e.keyCode == 37){player.movingLeft = false;}
        if(e.keyCode == 38){player.movingUp = false;}
        else if(e.keyCode == 40){player.movingDown = false;}
	}
}
