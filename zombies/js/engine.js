var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


var gameObjects = [];

var scene = {
	objects: [],
	add: function(obj){
		this.objects.push(obj);
	},
	del: function(obj){
		for(var i=0; i<this.objects.length; i++){
			if(this.objects[i] === obj){
				this.objects.splice(i,1);
			}
		}
	},
	render: function(){
		var obj;
		this.objects.sort(function(a, b){
			return b.z - a.z;
		})
		for(var i=0; i<this.objects.length; i++){
			obj = this.objects[i];
			obj.rotate = obj.rotate || 0;
			ctx.fillStyle = "rgba("+obj.rgba[0]+","+obj.rgba[1]+","+obj.rgba[2]+","+obj.rgba[3]+")";
			ctx.save();
			if(obj.rotate){
				ctx.translate(obj.x,obj.y);
			}
			ctx.rotate(obj.rotate*Math.PI/180);
			ctx.fillRect(obj.x,obj.y,obj.w,obj.h);
			ctx.restore();
		}
	},

}
function Game_Object(x,y,w,h){
	gameObjects.push(this)
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.z = 1;

	this.rgba = [255,0,0,1];
}

function Physics_Object(){
	this.vel_y = 0;
	this.vel_x = 0;
	this.accel_y = 0;
	this.accel_x = 0;
	this.max_vel = 15;
	this.check_collision_x = function(){
		for(var i=0; i<gameObjects.length; i++){
			var g = gameObjects[i];
			if(this.x + this.vel_x + this.w >= g.x &&
				this.x + this.vel_x <= g.x + g.w &&
				this.y + this.h >= g.y &&
				this.y <= g.y + g.h){
				return true;
			}
		}
		return false
	}
	this.check_collision_y = function(){
		for(var i=0; i<gameObjects.length; i++){
			var g = gameObjects[i];
			if(this.x + this.w >= g.x &&
				this.x <= g.x + g.w &&
				this.y + this.vel_y + this.h >= g.y &&
				this.y + this.vel_y <= g.y + g.h){
				return true;
			}
		}
		return false
	}
	this.add_gravity = function(){
		this.accel_y = 1;
	};
}

function Player(x,y,hp){
	Physics_Object.call(this);
	this.x = x;
	this.y = y;
	this.w = 25;
	this.h = 35;
	this.z = 25;
	this.rgba = [0,0,0,1];
	this.hp = hp;

	this.horizontal_speed = .5;
	

	this.animate = function(){
		if(!this.isOnGround){
			this.add_gravity();
		}
		if(input.up[1]){
			this.jump();
		}
		if(input.right[1]){
			this.accel_x = this.horizontal_speed;
		}
		if(input.left[1]){
			this.accel_x = -this.horizontal_speed;
		}
		if(this.vel_y + this.accel_y <= this.max_vel){this.vel_y += this.accel_y;}
		if(!this.check_collision_y()){
			this.y += this.vel_y;
			this.isOnGround = false;
		}
		else{
			this.isOnGround = true;
			this.accel_y = 0;
			this.vel_y = 0;
		}
		this.vel_x += this.accel_x;
		if(!this.check_collision_x()){
			this.x += this.vel_x
		}
		else{
			this.accel_x = 0;
			this.vel_x = 0;
		}

		this.vel_x *= .90;
		this.vel_y *= .90;
		this.accel_x *= .90;
		this.accel_y *= .90;
	}

	this.jump = function(){
		if(this.isOnGround){
			this.vel_y = -20;
		}
	}
}

function Zombie(x,y){
	Physics_Object.call(this);
	
	this.x = x;
	this.y = y;
	
	this.rgba = [0,120,0,1]
	
	this.body = {
		rgba: [0,120,0,1],
		rotation: 0,
		x: this.x,
		y: this.y,
		w: 30,
		h: 20,
	}
	this.arm = {
		rgba: [0,120,0,1],
		rotation: 180,
		x: this.x,
		y: this.y+30/2,
		w: 15,
		h: 5,
	}
	this.parts = [
	this.body, this.arm, 
	]
}


var input = {
	a: [32,false],
	b: [0,false],
	x: [0,false],
	y: [0,false],
	up: [87,false],
	right: [68,false],
	down: [83,false],
	left: [65,false],
}


document.addEventListener("keydown", keyDown)
document.addEventListener("keyup", keyUp)

function keyDown(e){
	var triggered = false;
	for(var i in input){
		if(e.keyCode === input[i][0]){
			input[i][1] = true;
			triggered = true;
		}
	}
	if(!triggered){
		console.log(e.keyCode)
	}
}
function keyUp(e){
	for(var i in input){
		if(e.keyCode === input[i][0]){
			input[i][1] = false;
		}
	}
}



function rand_int(n1,n2){
	return n1 + Math.floor(Math.random()*(n2-n1));
}
function rand_double(n1,n2){
	return n1 + Math.random()(n2-n1);
}
function rand_array(array){
	return array[rand_int(0,array.length)];
}

function rand_str(n, str){
	var str = str || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	var len = (str.split("")).length
	var result = "";
	for(var i=0; i<n; i++){
		result += str.charAt(rand_int(0,len));
	}
	return result;
}