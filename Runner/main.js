var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

var orbs = [];
var walls = [];
function init(){
	//if(!game_screen.mobile){sound.play(sound.list.background_music);}
	sound.play(sound.list.background_music);
	for(var i=0; i<100; i++){
		var x = rand_i(0,480);
		var y = rand_i(0,320);
		var w = rand_d(.25,5);
		var h = w;
		var s = -w;
		background.stars.push({
			x: x,
			y: y,
			w: w,
			h: h,
			s: s,
		})
	}
	wave_time = new Text(200, 360, "0", "32px Georgia", [255,255,255,1]);
	game.running = true;
	button_left = new Button(0,80,240,320);
	button_left.onTouch = function(){
		input.up = true;
	}
	button_left.onLift = function(){
		input.up = false;
	}
	button_right = new Button(240,80,240,320);
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
	running_frame: 0,
	total_frame: 0,
	running: false,
	trigger1Fired: false,
	awaitingInput: true,
	global_dxdy: 1,
	current_wave: 1,
	difficulty: 1,
	
	restart: function(){
		player.onScreen = true;
		game.frame = 0;
		game.global_dxdy = 1;
		game.current_wave = 1;
		game.difficulty = 1;

		button_left = new Button(0,80,240,320);
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
		

	    player.y = 155-player.h/2;
	    player.dy = 0;
	    player.ddy = 0;
	    player.hp = 3;
	    player.totalPoints += player.points;
		player.points = 0;
		player.spentPoints = 0;

	    weapons._default.framesPerShot = 20;
	    weapons._rocket.framesPerShot = 90;
	    weapons._plasma.framesPerShot = 120;
	    weapons._rocket.ammo = 0;
	    weapons._plasma.ammo = 0;

	    player.weapon = weapons._default;
		
	    walls = [];
	    orbs = [];
		enemies = [];
		projectiles = [];
		upgrades = [];

	    orb_vars.y_scaler = 110;
	    
	    game.awaitingInput = true;
	    game.running = true;
	    text_score = new Text(-100,30,player.points,"32px Georgia",[255,255,255,1])
		text_score.dx = 50;
		text_score.dy = 0;
		text_score.animate = function(){
			this.x += this.dx;
			this.y += this.dy;
			this.dx *= 0.9;
			this.dy *= 0.9;
		}
	},
	pause: function(){
		game.running = false;
	},
	unpause: function(){
		game.running = true;
	}
};
function game_loop(){
	//if(input.muted){Howler.mute()}
	resizeCanvas()
	ctx.clearRect(0,0,480,320);
	game.frame++;
	game.total_frame++;
	getButtonInput();
	animateEffects();
	if(game.running){
		game.running_frame ++;
		player.animate();
		animateEnemies();
		animateProjectiles();
		player.checkCollisions_orbs();
		player.checkCollisions_walls();
		animateOrbs();
		animateWalls();
		animateUpgrades();
		if(!game.awaitingInput){
		    orbGenerator();
		    wallGenerator();
			enemyGenerator();
			upgradeGenerator();
		}
	}
	background.animate();
	background.render();
	renderWalls();
	renderOrbs();
	renderUpgrades();
	renderEnemies();
	player.render();
	renderProjectiles();
	renderEffects();
	background.render_hearts();
	animateMenus();
	animateTexts();
	animateImages();
	renderMenus();
	renderImages();
	renderTexts();

	if(input.grid){
		for(var x=0; x<480; x+=10){
			ctx.strokeStyle='white';
			ctx.beginPath();
			ctx.moveTo(x,0);
			ctx.lineTo(x,320);
			ctx.closePath();
			ctx.stroke();
		};
		for(var y=0; y<320; y+=10){
			ctx.strokeStyle='white';
			ctx.beginPath();
			ctx.moveTo(0,y);
			ctx.lineTo(480,y);
			ctx.closePath();
			ctx.stroke();
		}
		ctx.strokeStyle = "red";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(120,0);
		ctx.lineTo(120,320);
		ctx.moveTo(240,0);
		ctx.lineTo(240,320);
		ctx.moveTo(360,0);
		ctx.lineTo(360,320);
		
		ctx.moveTo(0,80);
		ctx.lineTo(480,80);
		ctx.moveTo(0,160);
		ctx.lineTo(480,160);
		ctx.moveTo(0,240);
		ctx.lineTo(480,240);

		ctx.stroke();
		ctx.closePath();
	}
	requestAnimationFrame(game_loop);
}
function animateOrbs(){
	for(var i=0; i<orbs.length; i++){
		orbs[i].animate();
	}
}
function renderOrbs(){
	for(var i=0; i<orbs.length; i++){
		if(orbs[i] === undefined){return}
		orbs[i].render();
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
function setGameButtons(){
	button_left = new Button(0,0,240,320);
	button_left.onTouch = function(){
		input.up = true;
	}
	button_left.onLift = function(){
		input.up = false;
	}
	button_right = new Button(240,80,240,320);
	button_right.onTouch = function(){
		player.fire();
	}
}

function animate_wave_completed(){
	var t = new Text(100,0,"Wave "+((game.current_wave-1)+(waves.number_of_waves*(game.difficulty-1)))+" completed","32px Georgia",[255,255,255,1]);
	t.dy = 5;
	t.animate = function(){
		t.y += t.dy;
	}
	setTimeout(function(){del(t,texts)}, 1500)
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
	var points = player.points + player.spentPoints;
	var wave = ((game.current_wave-1)+(waves.number_of_waves*(game.difficulty-1)))
	text1 = new Text(495,80,"Game Over","48px Georgia",[255,255,255,1]);
	text2 = new Text(580,140,"Wave","32px Georgia",[255,255,255,1]);
	text3 = new Text(610-(wave.toString().length-1)*10,170,wave,"38px Georgia",[255,255,255,1])
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
			del(button1, buttons);
			del(text1, texts);
			del(text2, texts);
			del(text3, texts);
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

var background = {
	x: 0,
	y: 0,
	w: 0,
	h: 0,
	stars: [],
	dx: 1,
	animate: function(){
		for(var i=0; i<this.stars.length; i++){
			this.stars[i].x += this.stars[i].s*(this.dx);
			if(this.stars[i].x + this.stars[i].w <= 0){
				this.stars[i].x = 480;
				this.stars[i].y = rand_i(0,320-this.stars[i].h)
			}
		}
		if(game.awaitingInput && !game.trigger1Fired){
			s_frame = game.total_frame;
			game.trigger1Fired = true;
		}
		if(game.awaitingInput && s_frame){
			if(game.total_frame - s_frame > 0){
				text4 = new Text(30,350,"Tap to begin","32px Georgia",[255,255,255,1]);
				text4.dx = 0;
				text4.dy = -10;
				text4.animate = function(){
					text4.dx *= 0.9;
					text4.x += text4.dx;
					text4.dy *= 0.9;
					text4.y += text4.dy;
					if(game.total_frame % 11 === 0){
						text4.dy += 0.5*Math.sin(game.frame)
					}
				}
				button2 = new Button(0,80,480,320);
				button2.onTouch = function(){
					game.awaitingInput = false;
					game.frame = 0;
    				text4.dx = 60;
					del(button2,buttons);
					setTimeout(function(){
						del(text4,texts)
					},750)
					game.trigger1Fired = false;
				}
				s_frame = null;
			}
		}

	},
	render: function(){
		ctx.fillStyle='black';
		ctx.fillRect(0,0,480,320);
		ctx.beginPath()
		for(var n=0; n<this.stars.length; n++){
			ctx.rect(this.stars[n].x,this.stars[n].y,this.stars[n].w,this.stars[n].h)
		}
		ctx.fillStyle='white';
		ctx.fill()
	},
	
	render_hearts: function(){
	    for(var i=0; i<player.hp; i++){
			ctx.drawImage(heart_img,5+(i*42)+i*5,5,42,42)
		}
	}

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
	grid: false,
	muted: false,
};

document.addEventListener('keydown',keyDown);
document.addEventListener('keyup',keyUp);
document.addEventListener('mousemove',handleMousemove);
canvas.addEventListener('mousedown',handleMouseDown);
canvas.addEventListener('mouseup',handleMouseUp);
var mouse = {
    x: 0,
    y: 0,
};
function handleMousemove(e){
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}
function handleMouseDown(e){
	simulateTouchStart(e.clientX,e.clientY);
}
function handleMouseUp(e){
	simulateTouchEnd(e.clientX,e.clientY);
}
function keyDown(e){
	switch(e.keyCode){
		case 38:
		    //up
			simulateTouchStart(120*game_screen.dw + game_screen.padding_left, 160*game_screen.dh + game_screen.padding_top);
			break;
		case 40:
			//input.down = true;
			break;
		case 49:
			//1
			player.weapon = weapons._default;
			break;
		case 50:
			//2
			weapons._rocket.ammo = Infinity;
			player.weapon = weapons._rocket
			break;
		case 51:
			weapons._plasma.ammo = Infinity;
			player.weapon = weapons._plasma;
			//3
			break;
		case 52:
			//4
			break;
		case 68:
			//d
			simulateTouchStart(440*game_screen.dw,30*game_screen.dh);
			break;
		case 70:
			//f
			simulateTouchStart(360*game_screen.dw + game_screen.padding_left,160*game_screen.dh + game_screen.padding_top);
			break;
		case 71:
			input.grid = true;
			break;
		case 72:
			//h
			effects.ship.medium_particle_explosion(300,200,[0,0,255],[160,160,160])

			break;
		case 74:
			//j
			store.animate_open();
			break;
		case 75:
			//k
			Howler.volume(0);
			break;
		case 83:
			//s
			simulateTouchStart(40*game_screen.dw,30*game_screen.dh);
			break;
		case 32:
		    effects.ship.medium_particle_explosion(rand_i(0,480),rand_i(0,320))
		    break;
		case 192:
			if(document.getElementById('debug').style.visibility == "hidden"){
				document.getElementById('debug').style.visibility = "visible";
				document.getElementById('debuggerInput').style.visibility = "visible";
				document.getElementById('debuggerButton').style.visibility = "visible";
				game.pause();
			}
			else{
				document.getElementById('debug').style.visibility = "hidden";
				document.getElementById('debuggerInput').style.visibility = "hidden";
				document.getElementById('debuggerButton').style.visibility = "hidden";
				game.unpause();
			}
		default:
			console.log(e.keyCode)
	}
}
function keyUp(e){
	switch(e.keyCode){
		case 38:
			simulateTouchEnd(120*game_screen.dw + game_screen.padding_left, 160*game_screen.dh + game_screen.padding_top);
			break;
		case 40:
			//input.down = false;
			break;
		case 68:
			simulateTouchEnd(440*game_screen.dw,30*game_screen.dh);
			break;
		case 70:
			simulateTouchEnd(360*game_screen.dw + game_screen.padding_left, 160*game_screen.dh + game_screen.padding_top);
			break;
		case 71:
			input.grid = false;
			break;
		case 72:
			break;
		case 74:
			game.global_dxdy = 1;
			break;
		case 83:
			simulateTouchEnd(40*game_screen.dw,30*game_screen.dh);
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



function log(arg1,arg2,arg3,arg4,arg5){
	var args = []
	for(var i in arguments){
		if(!arguments[i].hasOwnProperty()){
			args.push(arguments[i])
		}
	}
	args = args.toString();
	console.log(args)
	document.getElementById('debug').value += args;
}

function evalInputData(){
    var txt = document.getElementById('debuggerInput').value;
    eval(txt);
}
