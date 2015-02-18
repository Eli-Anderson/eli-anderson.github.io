var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
var menu_list = [];
var text_list = [];
var image_list = [];
var highscores = [];
function menu_loop(){
	if(!game.playing){
		ctx.clearRect(0,0,720,480)
		draw_menu()
		draw_text()
		draw_image()
		requestAnimationFrame(menu_loop)
	}
}
function pre_menu(){
	for (var i=0;i<9;i++){
		if(localStorage.getItem('score'+i)=="undefined"){highscores.push("0")}
		else{highscores.push(localStorage.getItem('score'+i))}
	}
	create_menu(0,0,720,480,0,0,200,.8,function(){main_menu()})
	create_text(255,255,255,1,"88px Georgia","Title!",100,250)
}

function main_menu(){
	setTimeout(function(){
	menu_list = []
	text_list = []
	image_list = []
	create_menu(0,0,720,480,0,0,200,.8) // background
	create_menu(0,0,720,480,0,0,0,.5) // background
	create_text(255,255,255,1,"88px Georgia","PLAY",250,185) // PLAY
	create_menu(160,90,400,120,255,255,255,.2,function(){game.start()}) // PLAY button
	
	create_text(255,255,255,1,"48px Georgia","CHARACTERS",195,285) // CHARACTERS
	create_menu(160,220,400,90,255,255,255,.2,function(){sprite_menu()}) // CHARACTERS button
	
	create_text(255,255,255,1,"58px Georgia","HIGHSCORES",170,405) // HIGHSCORE
	create_menu(160,320,400,120,255,255,255,.2,function(){score_menu()}) // HIGHSCORE button
	},100)
}

function score_menu(){
	setTimeout(function(){
		menu_list = []
		text_list = []
		image_list = []
		highscores.sort(function(a,b){return(b-a)})
		for(var i=0;i<9;i++){
			create_text(255,255,255,1,"24px Georgia",(i+1)+". "+highscores[i],300,85+35*i)
		}
		create_menu(0,0,720,480,0,0,200,.8)
		create_menu(0,0,720,480,0,0,0,.5)
		create_text(255,255,255,1,"58px Georgia","HIGHSCORES",170,50)
		
		create_menu(15,380,120,75,0,0,0,.2,function(){main_menu()})
		create_text(255,255,255,1,"32px Georgia","BACK",35,425)
	},100)
}

function sprite_menu(){
	setTimeout(function(){
		menu_list = []
		text_list = []
		image_list = []
		
		create_menu(0,0,720,480,0,0,200,.8)
		create_menu(0,0,720,480,0,0,0,.5)
		create_text(255,255,255,1,"58px Georgia","CHARACTERS",170,50)
		
		create_menu(15,90,160,250,0,0,0,.2)
		create_image(player.sprite,15,110,160,200)
		
		create_menu(200,90,64,64,0,0,0,.2,function(){switch_char('indiana_jones')})
		create_image(player_sprites.indiana_jones.sprite,200,90,64,64)
		create_menu(265,90,64,64,0,0,0,.2,function(){switch_char('mgs')})
		create_image(player_sprites.mgs.sprite,265,90,64,64)
		create_menu(330,90,64,64,0,0,0,.2,function(){switch_char('indiana_jones')})
		create_image(player_sprites.indiana_jones.sprite,330,90,64,64)
		create_menu(395,90,64,64,0,0,0,.2,function(){switch_char('indiana_jones')})
		create_image(player_sprites.indiana_jones.sprite,395,90,64,64)
		
		create_menu(15,380,120,75,0,0,0,.2,function(){main_menu()})
		create_text(255,255,255,1,"32px Georgia","BACK",35,425)
		
		create_menu(585,380,120,75,0,0,0,.2,function(){level_menu()})
		create_text(255,255,255,1,"32px Georgia","LEVELS",595,425,105)
	},100)
}

function lose_menu(){
	highscores.push(String(game.score))
	highscores.sort(function(a,b){return b-a})
	
	setTimeout(function(){
		menu_list = []
		text_list = []
		image_list = []
		create_menu(0,0,720,480,0,0,0,.7,function(){main_menu()})
		create_menu(Math.random()*700,Math.random()*460,Math.random()*720,Math.random()*480,0,0,0,.2)
		create_menu(Math.random()*700,Math.random()*460,Math.random()*720,Math.random()*480,0,0,0,.2)
		create_menu(Math.random()*700,Math.random()*460,Math.random()*720,Math.random()*480,0,0,0,.2)
		create_menu(Math.random()*700,Math.random()*460,Math.random()*720,Math.random()*480,0,0,0,.2)
		create_menu(Math.random()*700,Math.random()*460,Math.random()*720,Math.random()*480,0,0,0,.2)
		create_text(255,255,255,1,'32px Georgia','SCORE:',300,50)
		create_text(255,255,255,1,'25px Georgia',game.score,300,150)
		create_text(255,255,255,1,'25px Georgia','Current highscore: '+highscores[0],300,200)
		for (var i=0;i<9;i++){
		localStorage.setItem('score'+i,highscores[i])
	}
	},150)
}
//
//
//
//
var indiana_jones = new Image();
indiana_jones.src = "indiana_jones.png"
var mgs = new Image();
mgs.src = 'mgs.png'
var boulder = new Image();
boulder.src = "boulder.png"
var fireball = new Image();
fireball.src = "fireball.png"

var player_sprites = {
	indiana_jones: {
		w: 80,
		h: 64,
		h_x: 34,
		h_x2: 0,
		h_y: 12,
		sprite: indiana_jones,
	},
	mgs: {
		w: 64,
		h: 64,
		h_x: 21,
		h_x2: 13,
		h_y: 0,
		sprite: mgs,
	}
}

var leftKey = false;
var upKey = false;
var rightKey = false;
var downKey = false;

var game = {
	playing: false,
	idle: false,
	score: 0,
	start: function(){
		if(game.playing == false){
			this.playing = true;
			menu_list = []
			text_list = []
			this.score = 0;
			start_drops(7)
			game_loop()
		}
	},
}

var drop = {
	w:64,
	h:64,
	sprite: fireball,
}

var drops = []

var player = {
	x: 100,
	y: 480-64,
	w: 80,
	h: 64,
	h_x: 34,
	h_x2: 0,
	h_y: 12,
	sprite: indiana_jones,
	hitbox_x: function(){return(this.x+this.h_x)},
	hitbox_y: function(){return(this.y+this.h_y)},
	hitbox_w: function(){return(this.w-(this.h_x+this.h_x2))},
	hitbox_h: function(){return(this.h-this.h_y)},
	dx: 7,
	friction: .95,
}

function animate_player(){

	if(player.x+player.w >= 720){player.x = 720-player.w}
	else if(player.x <= 0){player.x = 0}
	if(rightKey){
		if(player.dx <= 20){player.dx += 1}
	}
	else if(leftKey){
		if(player.dx >= -20){player.dx -= 1}
	}
	player.x += player.dx
	player.dx *= player.friction
}

function draw_player(){
	ctx.drawImage(player.sprite,player.x,player.y)
}
//
//
//

function create_drop(x,y,s){
	drops.push([x,y,s])
}

function animate_drop(){
	for(var i=0;i<drops.length;i++){
		drops[i][1] += drops[i][2];
		
		if(drops[i][1] >= 480){
			drops[i][0] = Math.random()*640;
			drops[i][1] = -drop.h;
			drops[i][2] = (Math.random()*10)+1;
			game.score += 50
		}
	}
}

function draw_drop(){
	for(var i=0;i<drops.length;i++){
		ctx.drawImage(drop.sprite,drops[i][0],drops[i][1],drop.w,drop.h)
	}
}

function start_drops(x){
	for(var i=0;i<x;i++){
		create_drop(Math.random()*(720-drop.w),(-Math.random()*300)-150,(Math.random()*10)+1)
	}
}
//
//
//
//
//

function check_collision(){
	for(var i=0;i<drops.length;i++){
		if(player.hitbox_x() < drops[i][0] + drop.w &&
		player.hitbox_x() + player.hitbox_w() > drops[i][0] &&
		player.hitbox_y() < drops[i][1] + drop.h &&
		player.hitbox_y() + player.hitbox_h() > drops[i][1]){
			game_over()
		}
	}
}
//
//
//
function game_over(){
	drops = []
	player.x = 100;
	game.playing = false
	lose_menu()
	menu_loop()
}
//
//
//

function game_loop(){
	if(game.playing){
		ctx.clearRect(0,0,720,480);
		animate_player()
		animate_drop()
		check_collision()
		draw_player()
		draw_drop()
		requestAnimationFrame(game_loop)
	}
}

//
//
//
//
function init(){
	pre_menu()
	menu_loop()
}
window.onload=init()

//
//
//
//
//
//
//
function switch_char(char){
	console.log('Player Switched')
	console.log(char)
	player.sprite = player_sprites[char].sprite;
	player.w = player_sprites[char].w;
	player.h = player_sprites[char].h;
	player.h_x = player_sprites[char].h_x;
	player.h_x2 = player_sprites[char].h_x2;
	player.h_y = player_sprites[char].h_y;
	sprite_menu();
}
//
//
//
//

	
document.addEventListener('keydown',keyDown,false)
function keyDown(e){
	//console.log(e.keyCode)
	if(e.keyCode == 76){log()}
	if(e.keyCode == 37){leftKey = true}
	else if(e.keyCode == 39){rightKey = true}
	if(e.keyCode == 38){if(player.onground){player.jumping = true}}
	else if(e.keyCode == 40){downKey = true}
}

document.addEventListener('keyup',keyUp,false)
function keyUp(e){
	if(e.keyCode == 37){leftKey = false}
	else if(e.keyCode == 39){rightKey = false}
	if(e.keyCode == 38){player.jumping = false}
	else if(e.keyCode == 40){downKey = false}
}

function log(){
	player.f()
}
