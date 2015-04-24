var explosions = [];
var particles = [];
var explosion_img = new Image();
explosion_img.src = "explosion.png"
function Explosion(x,y,w,h){
	explosions.push(this)
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	
	this.dx = -6;
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


function Particle(x,y,w,h,dx,dy){
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
Particle.prototype.animate = function(){
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
				del(this,particles);
			}
}
Particle.prototype.render = function(){
	ctx.save();
	ctx.globalAlpha = this.alpha;
	ctx.drawImage(asteroid_img,this.frameX,this.frameY,this.frameW,this.frameH,this.x,this.y,this.w,this.h);
	ctx.restore();
}

function small_particle_explosion(x,y){
    for(var i=0; i<10; i++){
        new Particle(x,y,7,7,-6+Math.cos(i),Math.sin(i));
    }
}
