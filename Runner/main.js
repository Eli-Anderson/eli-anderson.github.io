var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

var coins = []
var walls = []
function init(){
	game.running = true;
	game_loop()
}
var game = {
	frame: 0,
	running: false,
}
function game_loop(){
	ctx.clearRect(0,0,480,320)
	if(game.running){
		game.frame++
		player.animate();
		player.checkCollisions_coins();
		player.checkCollisions_walls();
		animateCoins();
		animateWalls();
		coinGenerator();
		wallGenerator();
	}
	renderCoins();
	renderWalls();
	player.render();
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

var player = {
	x: 10,
	y: 10,
	w: 30,
	h: 30,
	dy: 0,
	ddy: 0,
	maxVel: 5,
	points: 0,
	animate: function(){
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
		
		player.ddy *= .95;
		player.dy *= .95;
		

		debug.update(player.dy);
	},
	render: function(){
		ctx.fillStyle = "black";
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
			if(player.willCollide(coins[i])){
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
	gameOver: function(){
		game.running = false;
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
	text3 = new Text(605-(player.points.toString().length-1)*10,170,player.points,"38px Georgia",[255,255,255,1])
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
		}
	},1500)
	
}
var coin_vars = {
	framesSinceLastCoin: 0,
	y: 0,
	theda: 0,
}

function coinGenerator(){
	coin_vars.framesSinceLastCoin ++;
	if(coin_vars.framesSinceLastCoin == 10){
	    coin_vars.y = 160+140*Math.sin(coin_vars.theda);
		new Coin(500,coin_vars.y,1);
		coin_vars.framesSinceLastCoin = 0;
		coin_vars.theda += Math.PI/8;
	}
}
function Coin(x,y,p){
	coins.push(this);
	this.x = x;
	this.y = y;
	this.points = p;
	this.w = 15;
	this.h = 15;
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
		//del(this);
	}
}
Coin.prototype.render = function(){
	ctx.fillStyle = "yellow";
	ctx.fillRect(this.x,this.y,this.w,this.h)
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
		wall_vars.y = 20+Math.floor(Math.random()*280)
		wall_vars.w = 20+Math.floor(Math.random()*40)
		wall_vars.h = 20+Math.floor(Math.random()*40)

		new Wall(500,wall_vars.y,wall_vars.w,wall_vars.h);
		wall_vars.framesSinceLastWall = 0;
	}
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
	player.gameOver();
}
Wall.prototype.animate = function(){
	this.x -= 6;
	if(this.x < -20){
		//del(this);
	}
}
Wall.prototype.render = function(){
	ctx.fillStyle = "brown";
	ctx.fillRect(this.x,this.y,this.w,this.h);

	//ctx.drawImage(this.img,this.game.frameX,this.game.frameY,this.game.frameW,this.game.frameH,this.x,this.y,this.w,this.h)
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
}

var input = {
	up: false,
	down: true,
}

document.addEventListener('keydown',keyDown)
document.addEventListener('keyup',keyUp)
function keyDown(e){
	switch(e.keyCode){
		case 38:
			input.up = true;
			break;
		case 40:
			//input.down = true;
			break;
		case 72:
			input.h = true;
			player.points += 100;
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
	}
}
var debug = {
	elem: document.getElementById('debugger'),
	update: function(text){
		//debug.elem.innerHTML = text;
	}
}
//window.onload=init()
