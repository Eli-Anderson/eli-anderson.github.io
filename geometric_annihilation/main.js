var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

function Scene(){
	this.visible = true;
	this.objects = [];
	this.add = function(obj){
		if(!obj.z){obj.z = 10}
		this.objects.push(obj);
		this.objects.sort(function(a, b){
			return b.z - a.z;
		})
	};
	this.render = function(){
		for(var i=0; i<this.objects.length; i++){
			this.objects[i].render();
		}
	}
}

var scenes = {
	game: new Scene(),
}
var a = {
	x: 50,
	y: 50,
	w: 50,
	h: 50,
	render: function(){
		ctx.fillStyle = "red";
		ctx.fillRect(this.x,this.y,this.w,this.h);
	},
}
scenes.game.add(a);
var player = new Player(250,250);
scenes.game.add(player)

var GAME = {
	init: function(){
		this.current_scene = scenes.game;
		this.loop()
	},
	loop: function(){
		this.current_scene.render()
		requestAnimationFrame(this.loop)
	},
}



function Player(x,y){
	this.x = x;
	this.y = y;
	this.r = 10;
	this.hp = 100;

	this.rgba = [255,255,255,1]


	this.dy = 0;
	this.dx = 0;
	this.ddy = 0;
	this.ddx = 0;

	this.render = function(){
		ctx.beginPath();
		ctx.moveTo(this.x,this.y);
		ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
		ctx.fillStyle = toRgba(this.rgba);
		ctx.fill();
	}

	this.animate = function(){
		
	}
}



window.onload=detectDevice();