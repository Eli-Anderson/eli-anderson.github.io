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
	    if((player1.x+1 > entities[i].x && player1.x+1 < entities[i].x + entities[i].w && Math.abs((entities[i].y + entities[i].h) -player1.y) <= 3) ||
	       (player1.x+player1.w-1 > entities[i].x && player1.x+player1.w-1 < entities[i].x + entities[i].w && Math.abs((entities[i].y + entities[i].h) -player1.y) <= 3)
	    ){
	        player1.y = (entities[i].y + entities[i].h)+2;
	    }
	    if((player1.x+1 > entities[i].x && player1.x+1 < entities[i].x + entities[i].w && Math.abs((entities[i].y) - (player1.y + player1.h)) <= 3) ||
	       (player1.x+player1.w-1 > entities[i].x && player1.x+player1.w-1 < entities[i].x + entities[i].w && Math.abs((entities[i].y) - (player1.y + player1.h)) <= 3)
	    ){
	        player1.y = (entities[i].y - player1.h)-2;
	    }
	    if((player1.y+1 > entities[i].y && player1.y+1 < entities[i].y + entities[i].h && Math.abs((entities[i].x) - (player1.x + player1.w)) <= 3) ||
	       (player1.y+player1.h-1 > entities[i].y && player1.y+player1.h-1 < entities[i].y + entities[i].h && Math.abs((entities[i].x) - (player1.x + player1.w)) <= 3)
	    ){
	        player1.x = (entities[i].x - player1.w)-2;
	    }
	    if((player1.y+1 > entities[i].y && player1.y+1 < entities[i].y + entities[i].h && Math.abs((entities[i].x + entities[i].w) -player1.x) <= 3) ||
	       (player1.y+player1.h-1 > entities[i].y && player1.y+player1.h-1 < entities[i].y + entities[i].h && Math.abs((entities[i].x + entities[i].w) -player1.x) <= 3)
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
	var x = Math.round(this.x + (this.w/2) - ((this.x + this.w/2) % 32))/32;
    var y = Math.round(this.y + (this.h/2) - ((this.y + this.h/2) % 32))/32;
    var velx;
    var vely;
	var temp = d_field[y]
	if(temp){
	    velx += temp[x][0];
	    vely += temp[x][1];
	}

    velx *= .9;
    vely *= .9;
	var hyp = 50
	if(hyp <= this.aggroRange){
        if(this.type === 'rat'){
	        this.x += velx*this.speed;
	        this.y += vely*this.speed;
        }
        else if(this.type === 'mouse'){
            this.x -= dirx*this.speed;
            this.y -= diry*this.speed;
        }
	}
	for(var i=0; i<entities.length; i++){
	    if((this.x+1 > entities[i].x && this.x+1 < entities[i].x + entities[i].w && Math.abs((entities[i].y + entities[i].h) -this.y) <= 3) ||
	       (this.x+this.w-1 > entities[i].x && this.x+this.w-1 < entities[i].x + entities[i].w && Math.abs((entities[i].y + entities[i].h) -this.y) <= 3)
	    ){
	        this.y = (entities[i].y + entities[i].h)+2;
	    }
	    if((this.x+1 > entities[i].x && this.x+1 < entities[i].x + entities[i].w && Math.abs((entities[i].y) - (this.y + this.h)) <= 3) ||
	       (this.x+this.w-1 > entities[i].x && this.x+this.w-1 < entities[i].x + entities[i].w && Math.abs((entities[i].y) - (this.y + this.h)) <= 3)
	    ){
	        this.y = (entities[i].y - this.h)-2;
	    }
	    if((this.y+1 > entities[i].y && this.y+1 < entities[i].y + entities[i].h && Math.abs((entities[i].x) - (this.x + this.w)) <= 3) ||
	       (this.y+this.h-1 > entities[i].y && this.y+this.h-1 < entities[i].y + entities[i].h && Math.abs((entities[i].x) - (this.x + this.w)) <= 3)
	    ){
	        this.x = (entities[i].x - this.w)-2;
	    }
	    if((this.y+1 > entities[i].y && this.y+1 < entities[i].y + entities[i].h && Math.abs((entities[i].x + entities[i].w) -this.x) <= 3) ||
	       (this.y+this.h-1 > entities[i].y && this.y+this.h-1 < entities[i].y + entities[i].h && Math.abs((entities[i].x + entities[i].w) -this.x) <= 3)
	    ){
	        this.x = (entities[i].x + entities[i].w)+2;
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
	    if((player1.x+1 > entities[i].x && player1.x+1 < entities[i].x + entities[i].w && Math.abs((entities[i].y + entities[i].h) -player1.y) <= 2) ||
	       (player1.x+player1.w-1 > entities[i].x && player1.x+player1.w-1 < entities[i].x + entities[i].w && Math.abs((entities[i].y + entities[i].h) -player1.y) <= 2)
	    ){
	        player1.y = (entities[i].y + entities[i].h)+1;
	    }
	    if((player1.x+1 > entities[i].x && player1.x+1 < entities[i].x + entities[i].w && Math.abs((entities[i].y) - (player1.y + player1.h)) <= 2) ||
	       (player1.x+player1.w-1 > entities[i].x && player1.x+player1.w-1 < entities[i].x + entities[i].w && Math.abs((entities[i].y) - (player1.y + player1.h)) <= 2)
	    ){
	        player1.y = (entities[i].y - player1.h)-1;
	    }
	    if((player1.y+1 > entities[i].y && player1.y+1 < entities[i].y + entities[i].h && Math.abs((entities[i].x) - (player1.x + player1.w)) <= 2) ||
	       (player1.y+player1.h-1 > entities[i].y && player1.y+player1.h-1 < entities[i].y + entities[i].h && Math.abs((entities[i].x) - (player1.x + player1.w)) <= 2)
	    ){
	        player1.x = (entities[i].x - player1.w)-1;
	    }
	    if((player1.y+1 > entities[i].y && player1.y+1 < entities[i].y + entities[i].h && Math.abs((entities[i].x + entities[i].w) -player1.x) <= 2) ||
	       (player1.y+player1.h-1 > entities[i].y && player1.y+player1.h-1 < entities[i].y + entities[i].h && Math.abs((entities[i].x + entities[i].w) -player1.x) <= 2)
	    ){
	        player1.x = (entities[i].x + entities[i].w)+1;
	    }
	}
	
	
}
function backuptestCollision(){
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
function drawBuffer(){
	for(var y=0; y<map.length; y++){
	    for(var x=0; x<map[y].length; x++){
	    	if(floors.indexOf(map[y][x]) == -1){
	    		new Entity(32*x,32*y,32,32);
	    	}
	        buffer.drawImage(tiles,map[y][x]*32,0,32,32,32*x,32*y,32,32);
	    }
	}
	for(var p=0; p<objects.length; p++){
	        if(objects[p][0] == 91){
	            var lr = objects[p][1];
	            var lx = objects[p][4]*32;
	            var ly = objects[p][5]*32;
	            new LightSource(lx,ly,lr)
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
function init(){
	createVectorFieldBase()
	player1 = new Player(32,32,24,24);
	flashlight = new LightSource(200,200,125);
	lights.splice(0,1);
	flashlight.setPosition(player1.x,player1.y);
	setTimeout(function(){enemy1 = new Enemy(32*10,32*20,24,24,'rat')},2000)
	setTimeout(function(){enemy1.aggroRange=1000},2000)

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
    setTimeout(drawBuffer,10)
	setTimeout(loop,10)
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
    getVectorField()
	f_ctx.fillStyle='rgba(0,0,0,1)';
	f_ctx.fillRect(-x_translation,-y_translation,1200,600);
	//drawLightTile()
	player1.animate();
	animateEnemies();
	//testCollision();
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

function log(text){
    document.getElementById('log').innerHTML += (text+',')
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
		f_ctx.font = '16px Georgia';
		f_ctx.fillText("DEBUG", 500,500);

		for(var i=0; i<v_field.length; i++){
			for(var j=0; j<v_field.length; j++){
				if(v_field[i][j] !== Infinity){
					f_ctx.fillText(d_field[i][j],j*32+16,i*32+16)
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
		dx = left - center
	}
	else{
		dx = left - right;
	}

	if(top==Infinity){
		dy = center - bottom;
	}
	else if(bottom==Infinity){
		dy = top - center
	}
	else{
		dy = top - bottom;
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
	//console.log(t+','+r+','+b+','+l)
	return Math.min(t,r,b,l)
}

window.onload=preload();


/*
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
            }
            else{
            	v_field[a][b] = Infinity;
            }
        }
    }

}
*/
