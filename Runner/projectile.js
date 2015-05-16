var projectiles = [];




function Projectile(x,y,dx,dy,targets){
	projectiles.push(this);
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.targets = targets;
	this.onScreen = true;
}
Projectile.prototype.animate = function(){
	if(game.frame % 5 === 0){
		effects.ship.small_particle_explosion(this.x,this.y,[0,255,0])
	}
	this.dx *= game.global_dxdy;
	this.dy *= game.global_dxdy;
	if(this.targets[0] === undefined){
		if(isColliding_rr(this,this.targets)){
			this.onHit(this.targets);
			effects.ship.large_particle_explosion(this.x,this.y,[0,255,0])
		}
	}
	else{
		for(var i=0; i<this.targets.length; i++){
			var targ = this.targets[i];
			if(isColliding_rr(this,targ)){
				this.onHit(targ);
				effects.ship.medium_particle_explosion(this.x,this.y,[0,255,0])
			}
		}
	}
	if(!isColliding_rc(this,walls)){
		this.x += this.dx*this.spd;
		this.y += this.dy*this.spd;
	}
	else{
		for(var n=0; n<walls.length; n++){
			if(isColliding_rc(this,[walls[n]])){
				this.hitsWall(n)
			}
		}
	}


	if(this.x + this.w < 0 || this.x > 480 || this.y + this.h < 0 || this.y > 320){
		this.onScreen = false;
		del(this,projectiles)
	}
	else{this.onScreen = true;}
	
}
Projectile.prototype.render = function(){
	if(!this.onScreen){return;}
	ctx.drawImage(projectile_img,this.frameX,this.frameY,this.frameW,this.frameH,this.x,this.y,this.w,this.h)
}

Projectile_basic.prototype = Object.create(Projectile.prototype);
Projectile_basic.prototype.constructor = Projectile_basic;

function Projectile_basic(x,y,dx,dy,targets){
	Projectile.call(this,x,y,dx,dy,targets);
	this.w = 10;
	this.h = 10;
	this.dmg = 1;
	this.spd = 10;
	this.sound = sound.list.default_fire;
	this.explSize = 15;

	this.frameX = 5;
	this.frameY = 8;
	this.frameW = 18;
	this.frameH = 20;

	this.onHit = function(receiver){
		receiver.gotHit(this.dmg);
		del(this,projectiles);
		sound.play(this.sound);
		new Explosion(this.x,this.y,this.explSize,this.explSize);
		effects.ship.small_particle_explosion(this.x,this.y);
	};

	this.hitsWall = function(n){
		var x1 = this.x + this.w/2;
		var y1 = this.y + this.h/2;
		var x2 = walls[n].x;
		var y2 = walls[n].y;
		var angle = Math.atan((y2-y1)/(x2-x1));
		walls[n].dx += Math.cos(angle);
		walls[n].dy += Math.sin(angle);
		effects.asteroid.small_particle_explosion(this.x+this.w/2,this.y+this.h/2);
		del(this, projectiles);
	}
}

Projectile_rocket.prototype = Object.create(Projectile.prototype);
Projectile_rocket.prototype.constructor = Projectile_rocket;

function Projectile_rocket(x,y,dx,dy,targets){
	Projectile.call(this,x,y,dx,dy,targets);
	this.w = 12;
	this.h = 12;
	this.dmg = 3;
	this.spd = 11;
	this.sound = sound.list.rocket_explosion;
	this.explSize = 35;

	this.frameX = 5;
	this.frameY = 123;
	this.frameW = 18;
	this.frameH = 20;

	this.onHit = function(receiver){
		receiver.gotHit(this.dmg);
		del(this,projectiles);
		sound.play(this.sound);
		new Explosion(this.x,this.y,this.explSize,this.explSize);
	};

	this.hitsWall = function(n){
		var x = walls[n].x
		var y = walls[n].y
		effects.asteroid.medium_particle_explosion(x,y);
		new Explosion(x,y,35,35);
		del(this, projectiles);
		walls.splice(n,1)
	}
}

Projectile_plasma.prototype = Object.create(Projectile.prototype);
Projectile_plasma.prototype.constructor = Projectile_plasma;

function Projectile_plasma(x,y,dx,dy,targets){
	Projectile.call(this,x,y,dx,dy,targets);
	this.w = 6;
	this.h = 6;
	this.dmg = 2;
	this.spd = 14;
	this.sound = sound.list.plasma_fire;
	this.explSize = 100;

	this.frameX = 83;
	this.frameY = 12;
	this.frameW = 18;
	this.frameH = 20;

	this.onHit = function(receiver){
		receiver.gotHit(this.dmg);
		del(this,projectiles);
		sound.play(this.sound);
		for(var i=0; i<enemies.length; i++){
			var x1 = this.x + this.w/2;
			var y1 = this.y + this.h/2;
			var x2 = enemies[i].x + enemies[i].w/2;
			var y2 = enemies[i].y + enemies[i].h/2;
			if((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1) < Math.pow(this.explSize,2)){
				enemies[i].gotHit(this.dmg)
			}
		}
		new Explosion(this.x,this.y,this.explSize,this.explSize);
	};

	this.hitsWall = function(n){
		new Explosion(this.x,this.y,this.explSize,this.explSize);
		effects.asteroid.medium_particle_explosion(walls[n].x+walls[n].r/2,walls[n].y+walls[n].r/2);
		walls.splice(n,1);
		del(this,projectiles);
		sound.play(this.sound);
		for(var i=0; i<enemies.length; i++){
			var x1 = this.x + this.w/2;
			var y1 = this.y + this.h/2;
			var x2 = enemies[i].x + enemies[i].w/2;
			var y2 = enemies[i].y + enemies[i].h/2;
			if((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1) < Math.pow(this.explSize,2)){
				enemies.splice(i,1);
			}
		}
	}
}



Projectile_laser.prototype = Object.create(Projectile.prototype);
Projectile_laser.prototype.constructor = Projectile_laser;

function Projectile_laser(x,y,angle,targets){
	var that = this;
	setTimeout(function(){del(that,projectiles)}, 2000)
	Projectile.call(this,x,y,0,0,targets);
	this.h = 20;
	this.angle = angle;
	this.dmg = 2;
	this.spd = 14;
	this.sound = sound.list.plasma_fire;
	this.explSize = 100;
	this.last_hit_frame = 0;

	this.frameX = 83;
	this.frameY = 12;
	this.frameW = 18;
	this.frameH = 20;

	this.onHit = function(receiver){
		receiver.gotHit(this.dmg);
		del(this,projectiles);
		sound.play(this.sound);
		for(var i=0; i<enemies.length; i++){
			var x1 = this.x + this.w/2;
			var y1 = this.y + this.h/2;
			var x2 = enemies[i].x + enemies[i].w/2;
			var y2 = enemies[i].y + enemies[i].h/2;
			if((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1) < Math.pow(this.explSize,2)){
				enemies[i].gotHit(this.dmg);
			}
		}
		new Explosion(this.x,this.y,this.explSize,this.explSize);
	};

	this.hitsWall = function(n){
		new Explosion(this.x,this.y,this.explSize,this.explSize);
		effects.asteroid.medium_particle_explosion(walls[n].x+walls[n].r/2,walls[n].y+walls[n].r/2);
		walls.splice(n,1);
		//del(this,projectiles);
		sound.play(this.sound);
		for(var i=0; i<enemies.length; i++){
			var x1 = this.x + this.w/2;
			var y1 = this.y + this.h/2;
			var x2 = enemies[i].x + enemies[i].w/2;
			var y2 = enemies[i].y + enemies[i].h/2;
			if((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1) < Math.pow(this.explSize,2)){
				enemies.splice(i,1);
			}
		}
	};

	this.render = function(){
		ctx.lineWidth = this.h;
		ctx.strokeStyle = "red";
		ctx.beginPath();
		ctx.moveTo(this.x,this.y);
		ctx.lineTo(this.x + 480*Math.cos(this.angle),this.y + 480*Math.sin(this.angle));
		ctx.stroke();
		ctx.closePath();
	};
	this.animate = function(){
		var dx = (player.x+player.w/2)-this.x;
		var dy = (this.y)-(player.y+player.h/2);
		var hyp = Math.sqrt((Math.pow(dy,2)) + Math.pow(dx,2))
		var angle_to_player = Math.PI+Math.asin(dy/hyp)

		if(this.angle - angle_to_player <= Math.PI/48 && this.angle - angle_to_player >= -Math.PI/48){
			if(game.frame - this.last_hit_frame >= 30){
				player.gotHit(1);
				this.last_hit_frame = game.frame;
			}
		}
	}
}