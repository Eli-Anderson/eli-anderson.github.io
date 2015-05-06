var explosions = [];
var particles = [];

function Explosion(x,y,w,h){
	explosions.push(this)
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	
	this.dx = -3;
	this.dy = 0;

	this.frame = 0;
	this.frameX = 0;
	this.frameY = 0;

	this.frameCounter = 0;
}

Explosion.prototype.animate = function(){
	if(game.frame % 1 == 0){
		this.frameX = (this.frameCounter % 9) * 100;
		this.frameY = Math.floor(this.frameCounter / 9) * 100;
		this.frameCounter ++;
	}

	this.dx *= game.global_dxdy;
	this.dy *= game.global_dxdy;
	
	this.x += this.dx;
	this.y += this.dy;
}
Explosion.prototype.render = function(){
	ctx.drawImage(explosion_img,this.frameX,this.frameY,96,96,this.x-(this.w/2),this.y-(this.h/2),this.w,this.h)
}


function Asteroid_Particle(x,y,w,h,dx,dy){
	particles.push(this);
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	
	this.dx = dx;
	this.dy = dy;
	
	this.frameX = 0;
	this.frameY = 0;
	this.frameW = 120;
	this.frameH = 120;
	this.frameCounter = 0;
	
	this.alpha = 1;
	
	this.img = asteroid_img;
}
Asteroid_Particle.prototype.animate = function(){
	var dx = this.dx * game.global_dxdy;
	var dy = this.dy * game.global_dxdy;
	this.x += dx;
	this.y += dy;
	
	this.dx *= 0.99;
	this.dy *= 0.99;
	
	this.alpha *= 0.99;
	
	if(game.frame % 5 == 0){
			if(this.frameCounter < 15){this.frameCounter++}
			else{this.frameCounter = 0}
		}
			switch(this.frameCounter){
				case 0:
					this.frameX = 0;
					this.frameY = 0;
					break;
				case 1:
					this.frameX = 121;
					this.frameY = 0;
					break;
				case 2:
					this.frameX = 0;
					this.frameY = 121;
					break;
				case 3:
					this.frameX = 121;
					this.frameY = 121;
					break;
				case 4:
					this.frameX = 242;
					this.frameY = 0;
					break;
				case 5:
					this.frameX = 242;
					this.frameY = 121;
					break;
				case 6:
					this.frameX = 363;
					this.frameY = 0;
					break;
				case 7:
					this.frameX = 363;
					this.frameY = 121;
					break;
				case 8:
					this.frameX = 0;
					this.frameY = 242;
					break;
				case 9:
					this.frameX = 0;
					this.frameY = 363;
					break;
				case 10:
					this.frameX = 121;
					this.frameY = 242;
					break;
				case 11:
					this.frameX = 242;
					this.frameY = 242;
					break;
				case 12:
					this.frameX = 121;
					this.frameY = 363;
					break;
				case 13:
					this.frameX = 242;
					this.frameY = 363;
					break;
				case 14:
					this.frameX = 363;
					this.frameY = 242;
					break;
				case 15:
					this.frameX = 363;
					this.frameY = 363;
					break;
			}
			if(this.alpha < .01){
				del(this, particles);
			}
}
Asteroid_Particle.prototype.render = function(){
	ctx.save();
	ctx.globalAlpha = this.alpha;
	ctx.drawImage(asteroid_img,this.frameX,this.frameY,this.frameW,this.frameH,this.x-this.w/2,this.y-this.h/2,this.w,this.h);
	ctx.restore();
}
function Ship_Particle(x,y,w,h,dx,dy,rgb){
	particles.push(this);
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.dx = dx;
	this.dy = dy;
	this.alpha = 1;
	this.rgb = "rgba("+rgb[0]+","+rgb[1]+","+rgb[2];
}
Ship_Particle.prototype.animate = function(){
	this.x += this.dx;
	this.y += this.dy;
	this.dx *= 0.95;
	this.dy *= 0.95;
	this.alpha *= 0.95;
	if(this.alpha < 0.01){
		del(this, particles);
	}
};
Ship_Particle.prototype.render = function(){
	ctx.fillStyle=this.rgb + "," +this.alpha+")";
	ctx.fillRect(this.x,this.y,this.w,this.h);
}
var effects = {
	asteroid: {
		small_particle_explosion: function (x,y){
	    	for(var i=0; i<10; i++){
	    		var r = rand_i(3,12);
				var ry = rand_i(-2,2);
				var rx = rand_i(-2,2);
	        	new Asteroid_Particle(x,y,r,r,-6+rx+Math.cos(i),ry+Math.sin(i));
	    	}
		},
		medium_particle_explosion: function(x,y){
			for(var i=0; i<6; i++){
				var r = rand_i(30,70);
				var ry = rand_i(-2,2);
				var rx = rand_i(-2,2);
	        	new Asteroid_Particle(x,y,r,r,-6+rx+Math.cos(i),ry+Math.sin(i));
	    	}
		},
	},
	ship: {
		small_particle_explosion: function (x,y,rgb1,rgb2){
	    	for(var i=0; i<Math.PI/2; i+=Math.PI/10){
	    	    var rgb1 = rgb1 || [rand_i(160,200),rand_i(160,200),rand_i(160,200)]
	    	    var rgb2 = rgb2 || [rand_i(160,200),rand_i(160,200),rand_i(160,200)]
	    		var w = rand_i(2,5);
	    		var h = rand_i(2,5)
				var ry = rand_i(-2,2);
				var rx = rand_i(-2,2);
	        	new Ship_Particle(x,y,w,h,-6+rx+Math.cos(i),ry+Math.sin(i),rand_a([rgb1,rgb2]));
	    	}
		},
		medium_particle_explosion: function(x,y,rgb1,rgb2){
			for(var i=0; i<Math.PI*2; i+=Math.PI/3){
			    var rgb1 = rgb1 || [rand_i(160,200),rand_i(160,200),rand_i(160,200)]
	    	    var rgb2 = rgb2 || [rand_i(160,200),rand_i(160,200),rand_i(160,200)]
				var w = rand_i(5,9);
				var h = rand_i(5,9);
				var ry = rand_i(-2,2);
				var rx = rand_i(-2,2);
	        	new Ship_Particle(x,y,w,h,-6+rx+Math.cos(i),ry+Math.sin(i),rand_a([rgb1,rgb2]));
	    	}
		},
		large_particle_explosion: function(x,y,rgb){
			var rgb = rgb || [rand_i(160,200),rand_i(160,200),rand_i(160,200)]
	    	for(var i=0; i<Math.PI/2; i+=Math.PI/100){
	    		var w = rand_i(2,5);
	    		var h = rand_i(2,5)
				var ry = rand_i(-5,5);
				var rx = rand_i(-5,5);
	        	new Ship_Particle(x,y,w,h,-6+rx+Math.cos(i),ry+Math.sin(i),rgb);
				console.log(i)
	    	}
		},
		smoke_trail: function(x,y,darkness){
			//darkness should be a number between 0 (black) and 1 (white)
			var rgb = [Math.round(darkness*255), Math.round(darkness*255), Math.round(darkness*255)]
			for(var i=0; i<Math.PI*2; i+=Math.PI/3){
				var w = rand_i(5,9);
				var h = rand_i(5,9);
				var ry = rand_i(-2,2);
				var rx = rand_i(-2,2);
	        	new Ship_Particle(x,y,w,h,-6+rx+Math.cos(i),ry+Math.sin(i),rgb);
	        }
		},
	}
}
