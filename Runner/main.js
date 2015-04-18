var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

var coins = [];
var walls = [];
function init(){
	game.running = true;
	button_left = new Button(0,0,240,320);
	button_left.onTouch = function(){
		input.up = true;
	}
	button_right = new Button(240,0,240,320);
	button_right.onTouch = function(){
		player.fire();
	}
	game_loop()
}
var game = {
	frame: 0,
	running: false,
	trigger1Fired: false,
	awaitingInput: true,
	
	restart: function(){
		button_left = new Button(0,0,240,320);
		button_left.onTouch = function(){
			input.up = true;
		}
		button_right = new Button(240,0,240,320);
		button_right.onTouch = function(){
			player.fire();
		}

	    player.y = 155-player.h/2;
	    player.dy = 0;
	    player.ddy = 0;
	    player.totalPoints += player.points;
	    player.points = 0;
	    player.hp = 3;
		
	    walls = [];
	    coins = [];
		enemies = [];
		projectiles = [];

	    coin_vars.y_scaler = 110;
	    
	    game.awaitingInput = true;
	    game.running = true;
	},
};
function game_loop(){
	ctx.clearRect(0,0,480,320);
	game.frame++;
	if(game.running){
		player.animate();
		animateEnemies();
		animateProjectiles();
		player.checkCollisions_coins();
		player.checkCollisions_walls();
		animateCoins();
		animateWalls();
		if(!game.awaitingInput){
		    coinGenerator();
		    wallGenerator();
			enemyGenerator();
		}
	}
	background.animate();
	background.render();
	renderWalls();
	renderCoins();
	renderEnemies();
	player.render();
	renderProjectiles();
	animateMenus();
	animateTexts();
	renderMenus();
	renderTexts();
	requestAnimationFrame(game_loop)
}
function animateCoins(){
	for(var i=0; i<coins.length; i++){
		coins[i].animate();
	}
}
function renderCoins(){
	for(var i=0; i<coins.length; i++){
		if(coins[i] === undefined){return}
		coins[i].render();
	}
}
function animateWalls(){
	for(var i=0; i<walls.length; i++){
		walls[i].animate();
	}
}
function renderWalls(){
	for(var i=0; i<walls.length; i++){
		walls[i].render();
	}
}
function animateEnemies(){
	for(var i=0; i<enemies.length; i++){
		enemies[i].animate();
	}
}
function renderEnemies(){
	for(var i=0; i<enemies.length; i++){
		if(enemies[i] === undefined){return}
		enemies[i].render();
	}
}
function animateProjectiles(){
	for(var i=0; i<projectiles.length; i++){
		projectiles[i].animate();
	}
}
function renderProjectiles(){
	for(var i=0; i<projectiles.length; i++){
		if(projectiles[i] === undefined){return}
		projectiles[i].render();
	}
}

var player = {
	x: 10,
	w: 30,
	h: 30,
	y: 140,
	dy: 0,
	ddy: 0,
	maxVel: 5,
	points: 0,
	totalPoints: 0,
	hp: 3,
	r: 0,
	g: 0,
	b: 0,
	animate: function(){
	    if(game.awaitingInput){
	        return;
	    }
		if(player.hp === 0){player.gameOver();}
		if(Math.abs(this.dy) < 0.01){this.dy = 0}
		if(input.up){
			player.ddy = -0.25;
		}
		else if(input.down){
			player.ddy = 0.25;
		}
		else{player.ddy = 0}
		if(Math.abs(player.dy + player.ddy) < player.maxVel){
			player.dy += player.ddy;
		}
		
		player.y += player.dy;
		
		player.ddy *= 0.95;
		player.dy *= 0.95;
		
		player.r = 120+ 20*Math.round(player.dy);
	},
	render: function(){
		ctx.fillStyle = "rgb("+player.r+","+player.g+","+player.b+")";
		ctx.fillRect(player.x,player.y,player.w,player.h);
		//ctx.drawImage(player.spriteSheet,player.game.frameX,player.game.frameY,
		//              player.x,player.y,player.game.frameW,player.game.frameH)
	},
	willCollide: function(obj){
		var p = player;
			var c = obj;
			if(p.x+p.w > c.x &&
				p.x < c.x+c.w &&
				p.y+p.h > c.y &&
				p.y < c.y+c.h){
					return true
				}
			else{return false}
	},
	checkCollisions_coins: function(){
		for(var i=0; i<coins.length; i++){
			if(player.willCollide(coins[i]) && coins[i].touchable){
				coins[i].touched();
			}
		}
	},
	checkCollisions_walls: function(){
		for(var i=0; i<walls.length; i++){
			if(player.willCollide(walls[i])){
				walls[i].touched();
			}
		}
	},
	fire: function(){
		var dx = player.x - this.x;
		new Projectile(this.x,this.y,10,10,1,0,1,12,enemies)
	},
	gotHit: function(dmg){
		player.hp -= dmg;
	},
	gameOver: function(){
		game.running = false;
		button_left = null;
		button_right = null;
		animLoseScreen();
	}
}
function animLoseScreen(){
	menu1 = new Menu(60,-280,360,240,[0,0,0,1]);
	menu1.dy = 34;
	menu1.dx = 0;
	menu1.animate = function(){
		menu1.dy *= 0.9;
		menu1.y += menu1.dy;
		menu1.dx *= 0.9;
		menu1.x += menu1.dx;
	};
	text1 = new Text(495,80,"Game Over","48px Georgia",[255,255,255,1]);
	text2 = new Text(580,140,"Score","32px Georgia",[255,255,255,1]);
	text3 = new Text(610-(player.points.toString().length-1)*10,170,player.points,"38px Georgia",[255,255,255,1])
	setTimeout(function(){
		text1.dx = -42;
		text1.dy = 0;
		text1.animate = function(){
			text1.dx *= 0.9;
			text1.x += text1.dx;
			text1.dy *= 0.9;
			text1.y += text1.dy;
		}
	},750)
	setTimeout(function(){
		text2.dx = -42;
		text2.dy = 0;
		text2.animate = function(){
			text2.dx *= 0.9;
			text2.x += text2.dx;
			text2.dy *= 0.9;
			text2.y += text2.dy;
		}
		text3.dx = -42;
		text3.dy = 0;
		text3.animate = function(){
			text3.dx *= 0.9;
			text3.x += text3.dx;
			text3.dy *= 0.9;
			text3.y += text3.dy;
		}
		button1 = new Button(0,0,480,320);
		button1.onTouch = function(){
			text1.dy = text2.dy = text3.dy = -42;
			menu1.dx = -80;
			del(button1);
			del(text1);
			del(text2);
			del(text3);
			button1 = null;
			game.restart();
		}
	},1500)
	
}
var coin_vars = {
	framesSinceLastCoin: 0,
	y: 0,
	theda: 0,
	y_scaler: 110,
	counter: 0,
}

function coinGenerator(){
	coin_vars.framesSinceLastCoin ++;
	if(coin_vars.framesSinceLastCoin == 10){
		if(coin_vars.y_scaler >= 150){
			coin_vars.y_scaler *= rand_d(0.9,1);
		}
		else{coin_vars.y_scaler *= rand_d(0.9,1.1);}
	    coin_vars.y = 160+coin_vars.y_scaler*Math.sin(coin_vars.theda);
		new Coin(500,coin_vars.y,1);
		coin_vars.framesSinceLastCoin = 0;
		coin_vars.theda += Math.PI/8;
		coin_vars.counter ++;
	}
}
function Coin(x,y,p){
	coins.push(this);
	this.x = x;
	this.y = y;
	this.points = p;
	this.w = 15;
	this.h = 15;

	this.onScreen = true;
	this.touchable = true;
}
Coin.prototype.touched = function(){
	del(this);
	player.points += this.points;
	//delete this;
	//sounds.play(sounds.coin));
}
Coin.prototype.animate = function(){
	this.x -= 6;
	if(this.x < -20){
		this.onScreen = false;
	}
	for(var i=0; i<walls.length; i++){
		var dx = walls[i].x - this.x;
		var dy = walls[i].y - this.y;
		var dist1 = dx*dx + dy*dy;

		if(dist1 < 55*55){
			this.onScreen = false;
			this.touchable = false;
		}
	}
}
var coinImage = new Image();
coinImage.src = "coin_01.png";
Coin.prototype.render = function(){
	if(!this.onScreen){return}
	//ctx.fillStyle = "yellow";
	//ctx.fillRect(this.x,this.y,this.w,this.h)
	ctx.drawImage(coinImage,this.x,this.y,this.w+4,this.h+4)
}


var wall_vars = {
	framesSinceLastWall: 0,
	y: 0,
	w: 0,
	h: 0,
}

function wallGenerator(){
	wall_vars.framesSinceLastWall ++;
	if(wall_vars.framesSinceLastWall == 45){
		wall_vars.y = player.y+rand_i(-120,120)
		wall_vars.w = 20+Math.floor(Math.random()*40)
		wall_vars.h = 20+Math.floor(Math.random()*40)

		new Wall(500,wall_vars.y,wall_vars.w,wall_vars.h);
		wall_vars.framesSinceLastWall = 0;
	}
}
function rand_i(n1,n2){
	return n1+Math.floor(Math.random()*(n2-n1));
}
function rand_d(n1,n2){
	return n1+Math.random()*(n2-n1);
}
function Wall(x,y,w,h){
	walls.push(this);
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}
Wall.prototype.touched = function(){
	//sounds.play(sounds.hitWall)
	player.gotHit(player.hp);
}
Wall.prototype.animate = function(){
	this.x -= 6;
	if(this.x < -20){
		//del(this);
	}
};
Wall.prototype.render = function(){
	ctx.fillStyle = "brown";
	ctx.fillRect(this.x,this.y,this.w,this.h);

	//ctx.drawImage(this.img,this.game.frameX,this.game.frameY,this.game.frameW,this.game.frameH,this.x,this.y,this.w,this.h)
};
var background_img = new Image();
background_img.src = "desert_BG.png"
var background = {
	img: background_img,
	x: 0,
	y: 0,
	w: 0,
	h: 0,
	animate: function(){
		//background.x -= 3;
		//if(background.x + background.w <= canvas.width){
		//	background.x = 0;
		//}
		if(game.awaitingInput && !game.trigger1Fired){
			s_frame = game.frame;
			game.trigger1Fired = true;
		}
		if(game.awaitingInput && s_frame){
			if(game.frame - s_frame > 0){
				text4 = new Text(30,350,"Tap to begin","32px Georgia","0,0,0,1");
				text4.dx = 0;
				text4.dy = -10;
				text4.animate = function(){
					text4.dx *= 0.9;
					text4.x += text4.dx;
					text4.dy *= 0.9;
					text4.y += text4.dy;
					if(game.frame % 10 == 0){
						text4.dy += 3*Math.sin(game.frame)
					}
				}
				button2 = new Button(0,0,480,320);
				button2.onTouch = function(){
					game.awaitingInput = false;
    				input.up = true;
    				text4.dx = 60;
					del(button2);
					setTimeout(function(){
						del(text4)
					},750)
					game.trigger1Fired = false;
				}
				s_frame = null;
			}
		}

	},
	render: function(){
		//ctx.drawImage(background.img,-background.x,0,canvas.width,canvas.height,background.x,background.y,background.w,background.h)
		ctx.drawImage(background.img,0,0)
	},

}


function del(obj){
	for(var i=0; i<coins.length; i++){
		if(obj == coins[i]){
			coins.splice(i,1);
			return;
		}
	}
	for(var k=0; k<walls.length; k++){
		if(obj == walls[k]){
			walls.splice(k,1);
			return;
		}
	}
	for(var n=0; n<buttons.length; n++){
		if(obj == buttons[n]){
			buttons.splice(n,1);
			return;
		}
	}
	for(var t=0; t<texts.length; t++){
		if(obj == texts[t]){
			texts.splice(t,1);
			return;
		}
	}
	for(var u=0; u<projectiles.length; u++){
		if(obj == projectiles[u]){
			projectiles.splice(u,1);
			return;
		}
	}
}

var input = {
	up: false,
	down: true,
};

document.addEventListener('keydown',keyDown);
document.addEventListener('keyup',keyUp);
document.addEventListener('mousemove',handleMousemove);
var mouse = {
    x: 0,
    y: 0,
};
function handleMousemove(e){
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}
function keyDown(e){
	switch(e.keyCode){
		case 38:
			input.up = true;
			break;
		case 40:
			//input.down = true;
			break;
		case 72:
			//h
			new BasicEnemy(rand_i(320,455),rand_i(0,295),25,25);
			break;
		case 74:
			//j
			for(var i=0; i<10000; i++){
				new Coin(rand_i(320,455),rand_i(0,295),1);
			}
			break;
		case 32:
		    simulateTouchStart(mouse.x,mouse.y);
		    break;
		default:
			console.log(e.keyCode)
	}
}
function keyUp(e){
	switch(e.keyCode){
		case 38:
			input.up = false;
			break;
		case 40:
			//input.down = false;
			break;
		case 72:
			input.h = false;
			break;
		case 32:
		    simulateTouchEnd(mouse.x,mouse.y);
		    break;
	}
}
var debug = {
	elem: document.getElementById('debugger'),
	update: function(text){
		//debug.elem.innerHTML = text;
	}
}

function willCollide(obj,dx,dy,arr){
	if(arr[0] != undefined){
		for(var i=0; i<arr.length; i++){
			var a = arr[i];
			if(obj.x + obj.dx + obj.w > a.x &&
			obj.x + obj.dx < a.x + a.w &&
			obj.y + obj.dy + obj.h > a.y &&
			obj.y + obj.dy < a.y + a.h){
				return true;
			}
		}
	}
	else{
		var a = arr;
		if(obj.x + obj.dx + obj.w > a.x &&
			obj.x + obj.dx < a.x + a.w &&
			obj.y + obj.dy + obj.h > a.y &&
			obj.y + obj.dy < a.y + a.h){
				return true;
			}
	}
	return false;
}
