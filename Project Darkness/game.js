var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var fore_canvas = document.getElementById('forecanvas');
var f_ctx = fore_canvas.getContext('2d');
var hud_canvas = document.getElementById('hud');
var hud = hud_canvas.getContext('2d');
var buffer_canvas = document.getElementById('buffer');
var buffer = buffer_canvas.getContext('2d');

var rightKey,leftKey,upKey,downKey;
var entities = [];
var lights = [];
var enemies = [];



f_ctx.globalCompositeOperation = 'xor';
//
//
//
//
//
function Player(x,y,w,h){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.speed = 2;
	this.velx = 0;
	this.vely = 0;
}

Player.prototype.draw = function(){
	ctx.fillStyle='orange';
	ctx.fillRect(this.x,this.y,this.w,this.h);
};

Player.prototype.animate = function(){
	hud.fillStyle = 'white';
	hud.beginPath();
	hud.arc(mouse.x,mouse.y,2,0,2*Math.PI);
	hud.closePath();
	hud.fill();
	if(this.x + x_translation > 1200-camera.edge){moveCamera(-2,0);this.x-=this.speed}
	if(this.x + x_translation < camera.edge){moveCamera(2,0);this.x+=this.speed}
	if(this.y + y_translation > 600-camera.edge){moveCamera(0,-2);this.y-=this.speed}
	if(this.y + y_translation < camera.edge){moveCamera(0,2);this.y+=this.speed}
	flashlight.setPosition(this.x+this.w/2,this.y+this.h/2);
		if(rightKey && !testCollision()){this.velx = this.speed}
		else if(leftKey && !testCollision()){this.velx = -this.speed}
		else{this.velx = 0}
		if(downKey && !testCollision()){this.vely = this.speed}
		else if(upKey && !testCollision()){this.vely = -this.speed}
		else{this.vely = 0}

	if(debug_vars.noclip){
		if(rightKey){this.x += this.speed}
		if(leftKey){this.x += -this.speed}
		if(downKey){this.y += this.speed}
		if(upKey){this.y += -this.speed}
	}
	this.x += this.velx;
	this.y += this.vely;

	//this.velx *= .85;
	//this.vely *= .85;

};
//
//
//
//
//
//
function Enemy(x,y,w,h,type){
	enemies.push(this);
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.type = type;
	this.speed = 2;
	this.visible = false;
	this.aggroRange = 100;
	this.attackRange = 5;
}
Enemy.prototype.draw = function (){
	ctx.fillRect(this.x,this.y,this.w,this.h);
};
Enemy.prototype.animate = function (){
    var dirx = player1.x - this.x;
	var diry = player1.y - this.y;
	var hyp = Math.sqrt((dirx*dirx)+(diry*diry));
	dirx /= hyp;
	diry /= hyp;
	if(hyp <= this.aggroRange){
        if(this.type === 'rat'){
	        this.x += dirx*this.speed;
	        this.y += diry*this.speed;
        }
        else if(this.type === 'mouse'){
            this.x -= dirx*this.speed;
            this.y -= dirx*this.speed;
        }
	}
	for(var i=0; i<entities.length; i++){
	    if((this.x+1 > entities[i].x && this.x+1 < entities[i].x + entities[i].w && Math.abs((entities[i].y + entities[i].h) -this.y) <= 2) ||
	       (this.x+this.w-1 > entities[i].x && this.x+this.w-1 < entities[i].x + entities[i].w && Math.abs((entities[i].y + entities[i].h) -this.y) <= 2)
	    ){
	        this.y = (entities[i].y + entities[i].h)+1;
	    }
	    if((this.x+1 > entities[i].x && this.x+1 < entities[i].x + entities[i].w && Math.abs((entities[i].y) - (this.y + this.h)) <= 2) ||
	       (this.x+this.w-1 > entities[i].x && this.x+this.w-1 < entities[i].x + entities[i].w && Math.abs((entities[i].y) - (this.y + this.h)) <= 2)
	    ){
	        this.y = (entities[i].y - this.h)-1;
	    }
	    if((this.y+1 > entities[i].y && this.y+1 < entities[i].y + entities[i].h && Math.abs((entities[i].x) - (this.x + this.w)) <= 2) ||
	       (this.y+this.h-1 > entities[i].y && this.y+this.h-1 < entities[i].y + entities[i].h && Math.abs((entities[i].x) - (this.x + this.w)) <= 2)
	    ){
	        this.x = (entities[i].x - this.w)-1;
	    }
	    if((this.y+1 > entities[i].y && this.y+1 < entities[i].y + entities[i].h && Math.abs((entities[i].x + entities[i].w) -this.x) <= 2) ||
	       (this.y+this.h-1 > entities[i].y && this.y+this.h-1 < entities[i].y + entities[i].h && Math.abs((entities[i].x + entities[i].w) -this.x) <= 2)
	    ){
	        this.x = (entities[i].x + entities[i].w)+1;
	    }
	}

};
//
//
//
//
//
//
function Entity(x,y,w,h){
	entities.push(this);
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}

Entity.prototype.draw = function(){
	ctx.fillStyle='red';
	ctx.fillRect(this.x,this.y,this.w,this.h);
};
//
//
//
//
//
//
function LightSource(x,y,r){
	lights.push(this);
	this.x = x;
	this.y = y;
	this.r = r;
	this.on = true;
}

LightSource.prototype.setPosition = function(x,y){
	this.x = x;
	this.y = y;
};

LightSource.prototype.draw = function(){
	if(this.on){
		for(var r=this.r/2, x=this.r/2, a=1; r<=this.r; r+=x/5,a-=.2){
			f_ctx.fillStyle='rgba(255,255,255,'+a+')';
			f_ctx.beginPath();
			f_ctx.moveTo(this.x,this.y);
			f_ctx.arc(this.x,this.y,r,0,2*Math.PI);
			f_ctx.closePath();
			f_ctx.fill();
		}
		
	}
};
//
//
//
//
//
function testCollision(){
	for(var i=0; i<entities.length; i++){
		

		if((player1.x + player1.w + player1.velx >= entities[i].x || player1.y + player1.h + player1.vely >= entities[i].y) &&
			player1.x + player1.w >= entities[i].x &&
			player1.x < entities[i].x + entities[i].w &&
			player1.y + player1.h >= entities[i].y &&
			player1.y <= entities[i].y + entities[i].h){
			if(player1.velx == -player1.speed){player1.x += 2*player1.speed;}
			if(player1.velx == player1.speed){player1.x -= 2*player1.speed}
			if(player1.vely == -player1.speed){player1.y += 2*player1.speed}
			if(player1.vely == player1.speed){player1.y -= 2*player1.speed}
			return true;
		}
	}
	
}
var tiles = new Image();
tiles.src = 'tiles.png';
function drawBuffer(){
	for(var y=0; y<map.length; y++){
	    for(var x=0; x<map[y].length; x++){
	    	if(map[y][x] != 0){
	    		new Entity(32*x,32*y,32,32)
	    	}
	        buffer.drawImage(tiles,map[y][x]*32,0,32,32,32*x,32*y,32,32);
	    }
	}
}
function drawMap(){
    ctx.drawImage(buffer_canvas,0,0);
}
//
//
//
//
//
//
function init(){
	player1 = new Player(250,250,25,25);
	flashlight = new LightSource(200,200,125);
	lights.splice(0,1);
	flashlight.setPosition(player1.x,player1.y);
	lamp = new LightSource(300,300,200)
	enemy1 = new Enemy(300,500,25,25,'mouse');
	enemy2 = new Enemy(350,500,25,25,'rat');
	enemy2.aggroRange = 500


	flashlight.draw = function(){
	    for(var r=this.r/2, x=this.r/2, a=1; r<=this.r; r+=x/5,a-=.2){
	    	f_ctx.fillStyle='rgba(255,255,255,'+a+')';
	    	f_ctx.beginPath();
	    	f_ctx.moveTo(this.x,this.y);
	    	f_ctx.arc(this.x,this.y,r,mouse.angle-Math.PI/5,mouse.angle+Math.PI/5);
	    	f_ctx.closePath();
	    	f_ctx.fill();
	     }
        };
	loop();
	setTimeout(drawBuffer,500);
}
var x_translation = 0;
var y_translation = 0;
var camera = {
	edge: 250,
}
function moveCamera(x2,y2){
	x_translation += x2;
	y_translation += y2;
	ctx.translate(x2,y2);
	f_ctx.translate(x2,y2);
}

function drawEntities(){
	for(var i=0; i<entities.length; i++){
		entities[i].draw();
	}
}
function drawLightSources(){
	for(var i=0; i<lights.length; i++){
		lights[i].draw();
	}
}
function drawEnemies(){
	for(var i=0; i<enemies.length; i++){
		enemies[i].draw();
	}
}
function animateEnemies(){
	for(var i=0; i<enemies.length; i++){
		enemies[i].animate();
	}
}
function clearCanvases(){
	ctx.clearRect(-x_translation,-y_translation,1200,600);
	f_ctx.clearRect(-x_translation,-y_translation,1200,600);
	hud.clearRect(0,0,1200,600);
}
function loop(){
	clearCanvases()
	drawMap()
	f_ctx.fillStyle='rgba(0,0,0,.9)';
	f_ctx.fillRect(-x_translation,-y_translation,1200,600);
	player1.animate();
	animateEnemies();
	testCollision();
	//drawEntities();
	player1.draw();
	flashlight.draw()
	drawLightSources();
	drawEnemies();
	debug();
	requestAnimationFrame(loop);
}
var mouse = {
	x: 0,
	y: 0,
	angle: 0,
};
document.addEventListener('mousemove',function(e){
	mouse.x = e.clientX - 10;
	mouse.y = e.clientY - 10;
	mouse.angle = Math.atan2(mouse.y-flashlight.y-y_translation,mouse.x-flashlight.x-x_translation);
});

document.addEventListener('keydown',keyDown);
document.addEventListener('keyup',keyUp);

function keyDown(e){
	//console.log(e.keyCode)
	if(e.keyCode == 76){
		if(!debug_vars.trigger){debug_vars.trigger = true}
		else{debug_vars.trigger = false;}
	}

	if(e.keyCode == 65){leftKey = true}
	else if(e.keyCode == 87){upKey = true}
	if(e.keyCode == 68){rightKey = true}
	else if(e.keyCode == 83){downKey = true}
}
function keyUp(e){
	if(e.keyCode == 65){leftKey = false}
	else if(e.keyCode == 87){upKey = false}
	if(e.keyCode == 68){rightKey = false}
	else if(e.keyCode == 83){downKey = false}
}
var debug_trigger = false;
var debug_vars = {
	trigger: false,
	noclip: false,
}
function debug(){
	if(!debug_vars.trigger){
	    f_ctx.fillStyle = 'white';
		f_ctx.font = '20px Georgia';
		f_ctx.fillText(player1.velx, 500,500);
		debug_vars.noclip = true;
		
	}
	else{
		f_ctx.clearRect(0,0,1200,600);
		f_ctx.fillStyle = 'black';
		f_ctx.font = '20px Georgia';
		f_ctx.fillText(player1.velx, 500,500);
	}
}

window.onload=init();
