var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

var coins = [];
var walls = [];

var heart_img = new Image();
heart_img.src = 'heart.png';
function init(){
	for(var i=0; i<100; i++){
		background.stars.push({
			x: rand_i(0,480),
			y: rand_i(0,320),
		})
	}
	game.running = true;
	button_left = new Button(0,0,240,320);
	button_left.onTouch = function(){
		input.up = true;
	}
	button_left.onLift = function(){
		input.up = false;
	}
	button_right = new Button(240,0,240,320);
	button_right.onTouch = function(){
		player.fire();
	}
	text_score = new Text(-100,30,player.points,"32px Georgia",[255,255,255,1])
	text_score.dx = 50;
	text_score.dy = 0;
	text_score.animate = function(){
		this.x += this.dx;
		this.y += this.dy;
		this.dx *= 0.9;
		this.dy *= 0.9;
	}
	game_loop();
}
var game = {
	frame: 0,
	total_frame: 0,
	running: false,
	trigger1Fired: false,
	awaitingInput: true,
	global_dxdy: 1,
	
	restart: function(){
		player.onScreen = true;
		game.frame = 0;
		game.global_dxdy = 1;
		player.totalPoints += player.points;
		player.points = 0;

		button_left = new Button(0,0,240,320);
		button_left.onTouch = function(){
			input.up = true;
		}
		button_left.onLift = function(){
			input.up = false;
		}
		button_right = new Button(240,0,240,320);
		button_right.onTouch = function(){
			player.fire();
		}
		text_score = new Text(-100,30,player.points,"32px Georgia",[255,255,255,1])
		text_score.dx = 50;
		text_score.dy = 0;
		text_score.animate = function(){
			this.x += this.dx;
			this.y += this.dy;
			this.dx *= 0.9;
			this.dy *= 0.9;
		}

	    player.y = 155-player.h/2;
	    player.dy = 0;
	    player.ddy = 0;
	    player.hp = 3;
		
	    walls = [];
	    coins = [];
		enemies = [];
		projectiles = [];
		upgrades = [];

	    coin_vars.y_scaler = 110;
	    
	    game.awaitingInput = true;
	    game.running = true;
	},
};
function game_loop(){
	ctx.clearRect(0,0,480,320);
	game.frame++;
	game.total_frame++;
	getButtonInput();
	animateEffects();
	if(game.running){
		player.animate();
		animateEnemies();
		animateProjectiles();
		player.checkCollisions_coins();
		player.checkCollisions_walls();
		animateCoins();
		animateWalls();
		animateUpgrades();
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
	renderUpgrades();
	renderEnemies();
	player.render();
	renderProjectiles();
	renderEffects();
	animateMenus();
	animateTexts();
	renderMenus();
	renderTexts();
	requestAnimationFrame(game_loop);
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
function animateUpgrades(){
	for(var i=0; i<upgrades.length; i++){
		upgrades[i].animate();
	}
}
function renderUpgrades(){
	for(var i=0; i<upgrades.length; i++){
		if(upgrades[i] === undefined){return}
		upgrades[i].render();
	}
}
function animateEffects(){
	for(var i=0, arr = explosions.concat(particles); i<arr.length; i++){
		arr[i].animate();
	}
}
function renderEffects(){
	for(var i=0, arr = explosions.concat(particles); i<arr.length; i++){
		arr[i].render();
	}
}


function animLoseScreen(){
	text_score.dx = 20;
	setTimeout(function(){text_score = null},200)

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






function rand_i(n1,n2){
	return n1+Math.floor(Math.random()*(n2-n1));
}
function rand_d(n1,n2){
	return n1+Math.random()*(n2-n1);
}

var background_img = new Image();
background_img.src = "desert_BG.png"
var background = {
	img: background_img,
	x: 0,
	y: 0,
	w: 0,
	h: 0,
	stars: [],
	animate: function(){
		for(var i=0; i<this.stars.length; i++){
			this.stars[i].x -= 2;
			if(this.stars[i].x <= -2){
				this.stars[i].x = 480
			}
		}
		if(game.awaitingInput && !game.trigger1Fired){
			s_frame = game.total_frame;
			game.trigger1Fired = true;
		}
		if(game.awaitingInput && s_frame){
			if(game.total_frame - s_frame > 0){
				text4 = new Text(30,350,"Tap to begin","32px Georgia",[0,0,0,1]);
				text4.dx = 0;
				text4.dy = -10;
				text4.animate = function(){
					text4.dx *= 0.9;
					text4.x += text4.dx;
					text4.dy *= 0.9;
					text4.y += text4.dy;
					if(game.total_frame % 10 == 0){
						text4.dy += 3*Math.sin(game.frame)
					}
				}
				button2 = new Button(0,0,480,320);
				button2.onTouch = function(){
					game.awaitingInput = false;
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
		//ctx.drawImage(background.img,0,0);
		ctx.fillStyle='black';
		ctx.fillRect(0,0,480,320);
		
		for(var n=0; n<this.stars.length; n++){
			ctx.fillStyle='white';
			ctx.fillRect(this.stars[n].x,this.stars[n].y,2,2)
		}

		for(var i=0; i<player.hp; i++){
			ctx.drawImage(heart_img,5+(i*42)+i*5,5,42,42)
		}
	},

}



function del(obj,arr){
	for(var u=0; u<arr.length; u++){
		if(obj == arr[u]){
			arr.splice(u,1);
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
			simulateTouchStart(120, 160);
			break;
		case 40:
			//input.down = true;
			break;
		case 70:
			//f
			simulateTouchStart(360, 160);
			break;
		case 72:
			//h
			var asdf = new Enemy_easy(rand_i(320,455),rand_i(0,295));
			//asdf.magnet = true;
			break;
		case 74:
			//j
			for(var i=0; i<10; i++){
			new Particle(player.x,player.y,5,5,Math.cos(i),Math.sin(i))
		}
			break;
		case 75:
			//k
			new HealthUpgrade(rand_i(320,455),rand_i(0,295),1)
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
			simulateTouchEnd(120, 160);
			break;
		case 40:
			//input.down = false;
			break;
		case 70:
			simulateTouchEnd(360, 160);
			break;
		case 72:
			input.h = false;
			break;
		case 32:
		    simulateTouchEnd(mouse.x,mouse.y);
		    break;
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
		if(obj.x + dx + obj.w > a.x &&
			obj.x + dx < a.x + a.w &&
			obj.y + dy + obj.h > a.y &&
			obj.y + dy < a.y + a.h){
				return true;
			}
	}
	return false;
}

function rand_a(arr){
	var r = rand_i(0,arr.length);
	return arr[r];
}

function isColliding_rc(r,c_arr){
	for(var i=0; i<c_arr.length; i++){
		var c = c_arr[i];

		var distX = Math.abs(c.x - r.x-r.w/2);
	    var distY = Math.abs(c.y - r.y-r.h/2);

		if (distX > (r.w/2 + c.r)) { continue; }
    	if (distY > (r.h/2 + c.r)) { continue; }

		if (distX <= (r.w/2)) { return true; } 
		if (distY <= (r.h/2)) { return true; }

		var dx=distX-r.w/2;
		var dy=distY-r.h/2;
		if(dx*dx+dy*dy<=(c.r*c.r)){ return true; }
	}
	return false;
}
function isColliding_rr(r1,r2){
	if(r1.x + r1.w > r2.x &&
	r1.x < r2.x + r2.w &&
	r1.y + r1.h > r2.y &&
	r1.y < r2.y + r2.h){ return true; }
	return false;
}
