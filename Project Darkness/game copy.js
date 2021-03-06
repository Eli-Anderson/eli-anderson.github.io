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
var entity_vertices = [];
var lights = [];
var enemies = [];
var bullets = [];
var rays = [];
f_ctx.globalCompositeOperation = 'xor';
//
//
var floors = [0,1]
//
//
function preload(){
	count = 0;
	tiles = new Image();
	tiles.onload=handleLoad();
	tiles.src = 'tiles.png'
}
function handleLoad(){
	count++
	if(count == 1){
		setTimeout(init,250)
	}
}
//
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
	this.speed = 5;
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
	if(this.x + x_translation > 1200-camera.edge){moveCamera(-1*this.speed,0);this.velx-=this.speed}
	if(this.x + x_translation < camera.edge){moveCamera(1*this.speed,0);this.velx+=this.speed}
	if(this.y + y_translation > 600-camera.edge){moveCamera(0,-1*this.speed);this.vely-=this.speed}
	if(this.y + y_translation < camera.edge){moveCamera(0,1*this.speed);this.vely+=this.speed}
	flashlight.setPosition(this.x+this.w/2,this.y+this.h/2);
		if(rightKey){this.velx = this.speed}
		else if(leftKey){this.velx = -this.speed}
		else{this.velx = 0}
		if(downKey){this.vely = this.speed}
		else if(upKey){this.vely = -this.speed}
		else{this.vely = 0}
	for(var i=0; i<entities.length; i++){
	    if((player1.x > entities[i].x && player1.x < entities[i].x + entities[i].w && Math.abs((entities[i].y + entities[i].h) -player1.y) <= 3) ||
	       (player1.x+player1.w > entities[i].x && player1.x+player1.w < entities[i].x + entities[i].w && Math.abs((entities[i].y + entities[i].h) -player1.y) <= 3)
	    ){
	        player1.y = (entities[i].y + entities[i].h)+2;
	    }
	    if((player1.x > entities[i].x && player1.x < entities[i].x + entities[i].w && Math.abs((entities[i].y) - (player1.y + player1.h)) <= 3) ||
	       (player1.x+player1.w > entities[i].x && player1.x+player1.w < entities[i].x + entities[i].w && Math.abs((entities[i].y) - (player1.y + player1.h)) <= 3)
	    ){
	        player1.y = (entities[i].y - player1.h)-2;
	    }
	    if((player1.y > entities[i].y && player1.y < entities[i].y + entities[i].h && Math.abs((entities[i].x) - (player1.x + player1.w)) <= 3) ||
	       (player1.y+player1.h > entities[i].y && player1.y+player1.h < entities[i].y + entities[i].h && Math.abs((entities[i].x) - (player1.x + player1.w)) <= 3)
	    ){
	        player1.x = (entities[i].x - player1.w)-2;
	    }
	    if((player1.y > entities[i].y && player1.y < entities[i].y + entities[i].h && Math.abs((entities[i].x + entities[i].w) -player1.x) <= 3) ||
	       (player1.y+player1.h > entities[i].y && player1.y+player1.h < entities[i].y + entities[i].h && Math.abs((entities[i].x + entities[i].w) -player1.x) <= 3)
	    ){
	        player1.x = (entities[i].x + entities[i].w)+2;
	    }
	}

	if(debug_vars.noclip){
		if(rightKey){this.x += this.speed}
		if(leftKey){this.x += -this.speed}
		if(downKey){this.y += this.speed}
		if(upKey){this.y += -this.speed}
	}
	this.x += this.velx;
	this.y += this.vely;

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
	this.velx = 0;
	this.vely = 0;
	this.ax = 0;
	this.ay = 0;
	this.type = type;
	this.speed = 4;
	this.visible = false;
	this.aggroRange = 200;
	this.attackRange = 150;
	this.fired = false;
	this.rateOfFire = 500;
}
Enemy.prototype.draw = function (){
	ctx.fillRect(this.x,this.y,this.w,this.h);
};
Enemy.prototype.animate = function (){
    var distx = this.x - player1.x;
    var disty = this.y - player1.y;
    var hyp = Math.sqrt(distx*distx + disty*disty)
    var x = Math.round(this.x + (this.w/2) - ((this.x + this.w/2) % 32))/32;
    var y = Math.round(this.y + (this.h/2) - ((this.y + this.h/2) % 32))/32;
    if(d_field[y] !== undefined){
	this.ax = d_field[y][x][0];
    	this.ay = d_field[y][x][1];
    }
    if(Math.abs(this.velx) <= this.speed){
    	this.velx += this.ax;
    }
    if(Math.abs(this.vely) <= this.speed){
    	this.vely += this.ay;
    }
    this.velx *= .9;
    this.vely *= .9;
	if(hyp <= this.aggroRange){
        if(this.type === 'rat'){
	        this.x += this.velx;
	        this.y += this.vely;
	        if(!this.fired && hyp <= this.attackRange){
	            this.attack(player1);
	        }
        }
        else if(this.type === 'mouse'){
            //this.x -= dirx*this.speed;
            //this.y -= diry*this.speed;
        }
	}
	for(var i=0; i<entities.length; i++){
	    if((this.x > entities[i].x && this.x < entities[i].x + entities[i].w && Math.abs((entities[i].y + entities[i].h) -this.y) <= 3) ||
	       (this.x+this.w > entities[i].x && this.x+this.w < entities[i].x + entities[i].w && Math.abs((entities[i].y + entities[i].h) -this.y) <= 3)
	    ){
	        this.y = (entities[i].y + entities[i].h)+2;
	    }
	    if((this.x > entities[i].x && this.x < entities[i].x + entities[i].w && Math.abs((entities[i].y) - (this.y + this.h)) <= 3) ||
	       (this.x+this.w > entities[i].x && this.x+this.w < entities[i].x + entities[i].w && Math.abs((entities[i].y) - (this.y + this.h)) <= 3)
	    ){
	        this.y = (entities[i].y - this.h)-2;
	    }
	    if((this.y > entities[i].y && this.y < entities[i].y + entities[i].h && Math.abs((entities[i].x) - (this.x + this.w)) <= 3) ||
	       (this.y+this.h > entities[i].y && this.y+this.h < entities[i].y + entities[i].h && Math.abs((entities[i].x) - (this.x + this.w)) <= 3)
	    ){
	        this.x = (entities[i].x - this.w)-2;
	    }
	    if((this.y > entities[i].y && this.y < entities[i].y + entities[i].h && Math.abs((entities[i].x + entities[i].w) -this.x) <= 3) ||
	       (this.y+this.h > entities[i].y && this.y+this.h < entities[i].y + entities[i].h && Math.abs((entities[i].x + entities[i].w) -this.x) <= 3)
	    ){
	        this.x = (entities[i].x + entities[i].w)+2;
	    }
	}
};
Enemy.prototype.attack = function(target){
	var x = this.x;
	var y = this.y;
	var x2 = target.x;
	var y2 = target.y;
	var dx = x2-x;
	var dy = y2-y;
	var dist = Math.sqrt(dx*dx + dy*dy);
	dx/=dist;
	dy/=dist;
	if(dist > this.aggroRange){return}
	new Bullet(x,y,dx,dy,6);
	this.fired = true;
	var self = this;
	setTimeout(function(){self.fired = false},this.rateOfFire)
	
}
//
//
//
function Bullet(x,y,dx,dy,spd){
	bullets.push(this)
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.speed = spd
}
Bullet.prototype.animate = function(){
	this.x += this.dx*this.speed;
	this.y += this.dy*this.speed;
}
Bullet.prototype.draw = function(){
	ctx.fillStyle='yellow';
	ctx.fillRect(this.x,this.y,2,2);
}
//
//
//
function Entity(x,y,w,h){
	entities.push(this);
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	if(entity_vertices.indexOf([this.x,this.y])==-1){
		entity_vertices.push([this.x,this.y])
	}
	if(entity_vertices.indexOf([this.x,this.y+this.h])==-1){
		entity_vertices.push([this.x,this.y+this.h])
	}
	if(entity_vertices.indexOf([this.x+this.w,this.y+this.h])==-1){
		entity_vertices.push([this.x+this.w,this.y+this.h])
	}
	if(entity_vertices.indexOf([this.x+this.w,this.y])==-1){
		entity_vertices.push([this.x+this.w,this.y])
	}

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
		castRays(this.x,this.y,this.r,-Math.PI,Math.PI)
	}
};
//
//
//
//
//

function drawBuffer(){
	for(var y=0; y<map.length; y++){
	    for(var x=0; x<map[y].length; x++){
	    	var x1 = 32*x;
	    	var y1 = 32*y;
	    	if(floors.indexOf(map[y][x]) == -1){
	    		new Entity(x1,y1,32,32);
	    	}
	        buffer.drawImage(tiles,map[y][x]*32,0,32,32,x1,y1,32,32);
	        //if(entity_vertices.indexOf([x1,y1])==-1){
			//	entity_vertices.push([x1,y1])
			//}
			//if(entity_vertices.indexOf([x1,y1+32])==-1){
			//	entity_vertices.push([x1,y1+32])
			//}
			//if(entity_vertices.indexOf([x1+32,y1+32])==-1){
			//	entity_vertices.push([x1+32,y1+32])
			//}
			//if(entity_vertices.indexOf([x1+32,y1])==-1){
			//	entity_vertices.push([x1+32,y1])
			//}
	    }
	}
	for(var p=0; p<objects.length; p++){
		var a1 = objects[p][1];
		var a2 = objects[p][2];
		var a3 = objects[p][3];
		var a4 = objects[p][4];
		var a5 = objects[p][5];
		switch(objects[p][0]){
	    	case 91:
	            new LightSource(a4*32,a5*32,a1);
	            break;
	        case 101:
	        	new Enemy(a1,a2,a3,a4,a5);
	        	break;
		}
	}
}
function drawMap(){
    ctx.drawImage(buffer_canvas,0,0);
}
function drawLightTile(){
    f_ctx.fillStyle='rgba(255,255,255,.1)'
	for(var y=0; y<map.length; y++){
	    for(var x=0; x<map[y].length; x++){
	    	if(map[y][x] !== 0){
	    		f_ctx.fillRect(32*x,32*y,32,32)
	    	}
	    }
	}
}
//
//
//
//
//
//

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
function overlayShadow(){
	f_ctx.fillStyle='rgba(0,0,0,1)';
	f_ctx.fillRect(-x_translation,-y_translation,1200,600);
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
function drawBullets(){
	for(var i=0; i<bullets.length; i++){
		bullets[i].draw();
	}
}
function animateBullets(){
	for(var i=0; i<bullets.length; i++){
		bullets[i].animate();
	}
}

function clearCanvases(){
	ctx.clearRect(-x_translation,-y_translation,1200,600);
	f_ctx.clearRect(-x_translation,-y_translation,1200,600);
	hud.clearRect(0,0,1200,600);
}
var frame = 0;

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
var d_log = document.getElementById('log')
function log(text){
    d_log.innerHTML = '('+text+')';
}

function debug(){
	if(!debug_vars.trigger){
	    //f_ctx.fillStyle = 'white';
		//f_ctx.font = '20px Georgia';
		//f_ctx.fillText("DEBUG", 500,500);
		//debug_vars.noclip = true;
		
	}
	else{
		f_ctx.clearRect(-x_translation,-y_translation,1200,600);
		f_ctx.fillStyle = 'black';
		f_ctx.font = '11px Georgia';
		f_ctx.fillText("DEBUG", 500,500);

		for(var i=0; i<v_field.length; i++){
			for(var j=0; j<v_field.length; j++){
				if(v_field[i][j] !== Infinity){
					f_ctx.fillText(d_field[i][j],j*32,(i*32) + 24)
					f_ctx.beginPath();
					f_ctx.rect(j*32,i*32,32,32)
					f_ctx.stroke()
				}
			}
		}
		
	}
}
var v_field = []
var d_field = []
function createVectorFieldBase(){
	for(var y=0; y<map.length; y++){
		v_field.push([])
		d_field.push([])
		for(var x=0; x<map[y].length; x++){
				v_field[y][x] = Infinity;
				d_field[y].push([])
				d_field[y][x].push([0,0])

		}
	}
	v_field[0][0] = 0;
}
function getVectorField(){
	var h = v_field.length;
	var w = v_field[0].length;
    var x = Math.round(player1.x + (player1.w/2) - ((player1.x + player1.w/2) % 32))/32;
    var y = Math.round(player1.y + (player1.h/2) - ((player1.y + player1.h/2) % 32))/32;
    for(var i=0; i<h; i++){
        for(var j=x; j<w; j++){
        	if(floors.indexOf(map[i][j])!=-1){
        		v_field[y][x] = 0;
        		var dist = getClosestNeighbor(j,i) + 1
            	v_field[i][j] = dist;
            	if(i<h-1 && i>0 && j>0 && j<w-1){
            		setDirectionField(i,j)
            	}
            }
            else{
            	v_field[i][j] = Infinity;
            }
        }
    }
    for(var a=0; a<h; a++){
        for(var b=x; b>=0; b--){
        	if(floors.indexOf(map[a][b])!=-1){
        		v_field[y][x] = 0;
        		var dist2 = getClosestNeighbor(b,a) + 1
            	v_field[a][b] = dist2;
            	if(a<h-1 && a>0 && b>0){
            		setDirectionField(a,b)
            	}
            }
            else{
            	v_field[a][b] = Infinity;
            }
        }
    }
}
function setDirectionField(i,j){
	var dx,dy;
	var center = v_field[i][j]
	var left = v_field[i][j-1]
	var right = v_field[i][j+1]
	var top = v_field[i-1][j]
	var bottom = v_field[i+1][j]
	if(left==Infinity){
		dx = center - right;
	}
	else if(right==Infinity){
		dx = left - center;
	}
	else{
		dx = left - right;
	}
	if(right==Infinity && left==Infinity){
		dx = 0;
	}

	if(top==Infinity){
		dy = center - bottom;
	}
	else if(bottom==Infinity){
		dy = top - center;
	}
	else{
		dy = top - bottom;
	}
	if(bottom==Infinity && top==Infinity){
		dy = 0;
	}


	d_field[i][j][0] = dx;
	d_field[i][j][1] = dy;
}
function getClosestNeighbor(x,y){
	var t,r,b,l;
	if((v_field[y-1])){
		t = v_field[y-1][x]
	}
	else{t = Infinity}
	if(!isNaN(v_field[y][x+1])){
		r = v_field[y][x+1]
	}
	else{r = Infinity}
	if((v_field[y+1])){
		b = v_field[y+1][x]
	}
	else{b = Infinity}
	if(!isNaN(v_field[y][x-1])){
		l = v_field[y][x-1]
	}
	else{l = Infinity}
	return Math.min(t,r,b,l)
}
window.onload=preload();





function castRays(x,y,r,so,eo){
	f_ctx.beginPath();
    var sx = x;
    var sy = y;
	var ex=0;
	var ey=0;
    var points = []
    var endpoints = []
    endpoints.push([Math.round(r*Math.cos(so)+sx),Math.round(r*Math.sin(so)+sy)])
    //hud.strokeStyle='green'
    //hud.beginPath();
    //hud.moveTo(sx+x_translation,sy+y_translation)
    //hud.lineTo(endpoints[0][0]+x_translation,endpoints[0][1]+y_translation)
    //hud.stroke()
    for(var a=0; a<entity_vertices.length; a++){
    	var vert = {x: Math.round(entity_vertices[a][0]),y: Math.round(entity_vertices[a][1])};
    	var angle = Math.atan2(vert.y-sy,vert.x-sx);
    	//if(vert.x == 64 && vert.y == 64){log(angle*180/Math.PI)}
    	//if(a==0 && frame % 30 == 0){console.log(2*Math.PI+(so*180/Math.PI),2*Math.PI+(eo*180/Math.PI))}

    	var vert_hyp = Math.sqrt((sx-vert.x)*(sx-vert.x)+(sy-vert.y)*(sy-vert.y))
    	if(angle <= eo && angle >= so// && vert_hyp < 1.5*r
    		){
    		endpoints.push([vert.x,vert.y,angle]);
    		endpoints.push([r*Math.cos(angle+.0000001)+sx,r*Math.sin(angle+.0000001)+sy,angle+.0000001]);
    		endpoints.push([r*Math.cos(angle-.0000001)+sx,r*Math.sin(angle-.0000001)+sy,angle-.0000001]);
    	}
    }
    endpoints.push([Math.round(r*Math.cos(eo)+sx),Math.round(r*Math.sin(eo)+sy)])

    endpoints.sort(function(a,b){return a[2]-b[2]})
    for(var n=0; n<endpoints.length; n++){
	    ex = endpoints[n][0];
	    ey = endpoints[n][1];
	    //
	    hud.fillStyle='red'
	    hud.fillRect(ex+x_translation,ey+y_translation,2,2)
	    //
	    var dx = ex-sx;
	    var dy = ey-sy;
	    var hyp = Math.sqrt(dx*dx + dy*dy);
	    var dx_dt = dx/hyp;
	    var dy_dt = dy/hyp;
	    var slope = dy/dx;
	    var x = 0;
	    var y = 0;
	    var fun = function(){
	    	//NEED TO CHANGE THIS TO FIT
	    	
	    	//
	    	//
	    	//
	    	//
	    	//
	    	//
			for(var i=0; i<=hyp; i++){
				for(var t=0; t<entities.length; t++){
					x = Math.round(i*dx_dt + sx);
					y = Math.round(i*dy_dt + sy);
					var ent = entities[t]
					if(x % 32 == 0 &&
						(x == ent.x || x == ent.x+ent.w)&&
						y >= ent.y &&
						y <= ent.y+ent.h
					){
						points.push([x,y])
						return;
					}
					if(y % 32 == 0 &&
						(y == ent.y || y == ent.y+ent.h) &&
						x >= ent.x &&
						x <= ent.x+ent.w
					){
						points.push([x,y])
						return;
					}
					if(i==r-1){
						points.push([x,y])
						return
					}
				}
			}
		}
		fun()
    }
	
	f_ctx.moveTo(sx,sy);
	for(var e=0; e<points.length; e++){
		f_ctx.lineTo(points[e][0],points[e][1]);
		//hud.fillStyle='white'
		//hud.fillRect(points[e][0]+x_translation,points[e][1]+y_translation,2,2)
	}
	var grd = f_ctx.createRadialGradient(sx,sy,0,sx,sy,r);
	grd.addColorStop(0,'rgba(255,255,255,1)');
	grd.addColorStop(.25,'rgba(255,255,255,.5)');
	grd.addColorStop(.75,'rgba(255,255,255,.25)');
	grd.addColorStop(1,'rgba(255,255,255,0)');
	f_ctx.fillStyle=grd
	f_ctx.fill();
}




function init(){
	createVectorFieldBase()
	player1 = new Player(32,32,24,24);
	flashlight = new LightSource(200,200,125);
	lights.splice(0,1);
	new LightSource(200,200,200)
	flashlight.setPosition(player1.x,player1.y);
	setTimeout(function(){enemy1 = new Enemy(32*1,32*11,24,24,'rat')},2000)

	flashlight.draw = function(){
	    castRays(this.x,this.y,this.r,mouse.angle-Math.PI/4,mouse.angle+Math.PI/4)
    };
    setTimeout(drawBuffer,10)
	setTimeout(loop,10)
	entity_vertices.push([0,0],[0,1024],[1024,0],[1024,1024])
}
function loop(){
	frame++
	clearCanvases()
	drawMap()
    getVectorField()
	overlayShadow()
	flashlight.draw()
	player1.animate();
	animateEnemies();
	animateBullets();
	player1.draw();
	drawBullets();
	drawLightSources();
	drawEnemies();
	debug();
	requestAnimationFrame(loop);
}
