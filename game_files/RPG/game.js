var playersprite = new Image();
playersprite.src = 'images/player.png'
var player = {
	sprite: playersprite,
	currentSpriteX: 0,
	spriteWidth: 48,
	walking: false,
	movingRight: false,
    movingLeft: false,
    movingUp: false,
    movingDown: false,
	x: 0,
	y: 0,
    inventory: [item_block,item2,item3],
    interact: function(){alert('interact')}
}
var tick = 0;
var frame = 0;



function loadGame(){
	preDrawTiles()
	game_init()
}

function drawTiles(){
	ctx.drawImage(preCanv,0,0)
}

function preDrawTiles(){
	for (var i=0;i<currentMap.length;i++){
		for (var j=0;j<currentMap[i].length;j++){
			for (var n=0;n<currentMap[i][j].length;n++){
				preCanvCtx.drawImage(tileSheet,currentMap[i][j][n]*48,0,48,48,(j*48),(i*48),48,48);
			}
			
		}
	}
}

function drawPlayer(){
	ctx.drawImage(player.sprite,player.currentSpriteX,0,player.spriteWidth,player.spriteWidth,player.x,player.y,48,48)
}

function animatePlayer(){
	if (player.walking){
		if(player.movingRight && !checkCollision('right') && !player.movingLeft && !player.movingDown && !player.movingUp){
			player.x += 2;
			if(frame % 2 == 0){
				player.currentSpriteX = 1*player.spriteWidth
			}
			else{
				player.currentSpriteX = 2*player.spriteWidth
			}
		}
        else if(player.movingLeft && !checkCollision('left') && !player.movingRight && !player.movingDown && !player.movingUp){
			player.x -= 2;
			if(frame % 2 == 0){
				player.currentSpriteX = 7*player.spriteWidth
			}
			else{
				player.currentSpriteX = 8*player.spriteWidth
			}
		}
        if(player.movingUp && !checkCollision('up') && !player.movingLeft && !player.movingDown && !player.movingRight){
			player.y -= 2;
			if(frame % 2 == 0){
				player.currentSpriteX = 10*player.spriteWidth
			}
			else{
				player.currentSpriteX = 11*player.spriteWidth
			}
		}
        else if(player.movingDown && !checkCollision('down') && !player.movingLeft && !player.movingRight && !player.movingUp){
			player.y += 2;
			if(frame % 2 == 0){
				player.currentSpriteX = 4*player.spriteWidth
			}
			else{
				player.currentSpriteX = 5*player.spriteWidth
			}
		}
	}
	else{
		var v = player.currentSpriteX/48
		console.log(v)
        switch(v){
			case 0:
				break;
			case 1:
				player.currentSpriteX = 0;
				break;
			case 2:
				player.currentSpriteX = 0;
				break;
			case 3:
				player.currentSpriteX = 3*48;
				break;
			case 4:
				player.currentSpriteX = 3*48;
				break;
			case 5:
				player.currentSpriteX = 3*48;
				break;
			case 6:
				player.currentSpriteX = 6*48;
				break;
			case 7:
				player.currentSpriteX = 6*48;
				break;
			case 8:
				player.currentSpriteX = 6*48;
				break;
			case 9:
				player.currentSpriteX = 9*48;
				break;
			case 10:
				player.currentSpriteX = 9*48;
				break;
			case 11:
				player.currentSpriteX = 9*48;
				break;
		}
		
		
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
	var x = Math.round(player.x/48)
	var y = Math.round(player.y/48)
	switch (direction){
		case 'right':
            if(player.x > 430 &&
			   collidables.indexOf(worldMap[mapY][mapX+1][y][0][1]) == -1){
				changeMap()
			}
            if(player.x % 48 < 2){
				if(currentMap[y][x+1] != undefined){
		      		if(collidables.indexOf(currentMap[y][x+1][1]) != -1
					  ){
						player.currentSpriteX = 0;
                    	return true
					}
				}
				else{return true}
            }
			break;
		case 'left':
            if(player.x < 2){changeMap()}
            if(player.x % 48 < 2){
				if(currentMap[y][x-1] != undefined){
			    	if(collidables.indexOf(currentMap[y][x-1][1]) != -1){
						player.currentSpriteX = 2*player.spriteWidth;
                    	return true
					}
				}
				else{return true}
            }
			break;
		case 'up':
            if(player.y < 2){changeMap()}
            if(player.y % 48 < 2){
                if(currentMap[y-1]){
			         if(collidables.indexOf(currentMap[y-1][x][1]) != -1){
                         player.currentSpriteX = 4*player.spriteWidth;
                         return true}
                }
                else{return true}
            }
			break;
		case 'down':
            if(player.y > 430){changeMap()}
            if(player.y % 48 < 2){
                if(currentMap[y+1]){
		      	     if(collidables.indexOf(currentMap[y+1][x][1]) != -1){
                         player.currentSpriteX = 6*player.spriteWidth;
                         return true}
                }
                else{return true}
            }
			break;
	}
}
var mapX = 0
var mapY = 0
function changeMap(){
    mapX = mapX || 0;
    mapY = mapY || 0;
    if(Math.round(player.x) >= 430 &&
       player.movingRight &&
       worldMap[mapY][mapX+1]){
		player.x = 0;mapX++}
    if(Math.round(player.x) <= 2 &&
       player.movingLeft &&
	   worldMap[mapY][mapX-1]){
		player.x = 432;mapX--}
    if(Math.round(player.y) >= 430 &&
       player.movingDown &&
       worldMap[mapY+1]){
		player.y = 0;mapY++}
	
    if(Math.round(player.y) <= 2 &&
	   player.movingUp &&
	   worldMap[mapY-1]){
		player.y = 432;mapY--}
	
    
    currentMap = worldMap[mapY][mapX];
	preDrawTiles()
}

//BEGIN OVERLAY
var hud = document.getElementById('canvas2').getContext('2d')
function drawHud(){
    //hud.drawImage(toolbar,0,0)
}

//END OVERLAY
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
    
    //drawHud()
	requestAnimationFrame(gameLoop)
}

document.addEventListener('keydown',keyDown,false)
document.addEventListener('keyup',keyUp,false)
function keyDown(e){
	//alert(e.keyCode)
    if(e.keyCode == 76){log()}
    
    
    if(e.keyCode == 88){player.inventory[0].use()}
    if(e.keyCode == 90){player.interact()}
    
    
	if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40){
		player.walking = true;
		if(e.keyCode == 39){
			player.movingRight = true;
		}
        else if(e.keyCode == 37){
			player.movingLeft = true;
		}
        else if(e.keyCode == 38){
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

function log(){
    //var p = document.getElementById('log')
    //p.innerHTML += collidables.indexOf(currentMap[y][x+1]
	console.log(collidables.indexOf(2))
}
