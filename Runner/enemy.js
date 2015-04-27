var enemies = [];

var enemy_vars = {
	framesSinceLastEnemy: 0,
	frame: 0,
	framesPerEnemy: 300,
	options: [Enemy_easy],

}
/*  1 -- 60
	2 -- 120
	3 -- 180
	4 -- 240
	5 -- 300
	10 -- 600
	15 -- 900
	30 -- 1800
	45 -- 2700
	60 -- 3600

*/
function enemyGenerator(){
	enemy_vars.frame ++;
	enemy_vars.framesSinceLastEnemy ++;
	var f = enemy_vars.frame;
	if(enemy_vars.framesSinceLastEnemy < enemy_vars.framesPerEnemy){ return; }
	if(f > 300 && f < 1800){
		new Enemy_easy(rand_i(320,455),rand_i(0,295));
		enemy_vars.framesSinceLastEnemy = 0;
	}
	else if(f > 1800){
		new Enemy_medium(rand_i(320,455),rand_i(0,295));
		enemy_vars.framesSinceLastEnemy = 0;
	}
}

function Enemy(x,y){
	enemies.push(this);
	this.x = x;
	this.y = y;

	this.dx = 0;
	this.dy = 0;

	this.onScreen = true;
	
	this.frame = game.frame;

}
Enemy.prototype.render = function(){
	if(this.onScreen){
		//ctx.fillRect(this.x,this.y,this.w,this.h);
		ctx.drawImage(this.img,this.x,this.y,this.w,this.h)
	}
}
Enemy.prototype.gotHit = function(dmg){
	sound.play(this.sound);
	this.hp -= dmg;
	if(this.hp <= 0){
		//animate death
		//drop orbs or upgrades
		var x = this.x;
		var y = this.y;
		rand_a([
					function(){new HealthUpgrade(x,y,20,20,1)},
					function(){new RocketLauncherUpgrade(x,y,20,20,3)},
					function(){new Orb(x,y,5)},
				])()
		del(this,enemies);
	}
}

function Enemy_medium(x,y){
	Enemy.call(this,x,y);
	this.img = enemy_basic_img;
	this.w = 20;
	this.h = 20;

	this.maxVel = 3;
	this.framesPerShot = 90;
	this.hp = 3;
	this.worth = 3;

	this.ddy = 0;

	this.sound = sound.list.enemy_medium_hit;
	
	this.animate = function(){
		if(this.y < player.y){this.ddy = rand_i(0,2)}
		else{this.ddy = rand_i(-2,0);}
		if(Math.abs(this.dy) < this.maxVel){
			this.dy += this.ddy;
		}
		this.dy *= game.global_dxdy;
		this.dx *= game.global_dxdy;
		
		this.y += this.dy;
		this.dy *= 0.99;
		this.ddy *= 0.5;
		
		if((game.frame - this.frame) % this.framesPerShot === 0 && !game.awaitingInput){this.fire()}
	};
	this.fire = function(){
		var dx = player.x - this.x;
		var dy = player.y - this.y;
		var dist = Math.sqrt(dx*dx+dy*dy);
		dx/=dist;
		dy/=dist;
		new Projectile_basic(this.x,this.y,-1,0,player);
	};
}
Enemy_medium.prototype = Object.create(Enemy.prototype);
Enemy_medium.prototype.constructor = Enemy_medium;

function Enemy_easy(x,y){
	Enemy.call(this,x,y);
	this.img = enemy_basic_img;
	this.w = 25;
	this.h = 25;

	this.maxVel = 3;
	this.framesPerShot = 90;
	this.hp = 1;
	this.worth = 3;
	this.counter = 0;
	this.dy = 0;
	this.dx = 0;
	this.friction = 0.99;
	this.sound = sound.list.enemy_easy_hit;
	
	this.animate = function(){
		this.dy = 4*Math.cos(this.counter);
		
		this.dy *= game.global_dxdy;
		this.dx *= game.global_dxdy;
		
		this.y += this.dy;
		
		if((game.frame - this.frame) % this.framesPerShot === 0 && !game.awaitingInput){this.fire()}
		this.counter += Math.PI/128;
	};
	this.fire = function(){
		new Projectile_basic(this.x,this.y,-1,0,player);
	};
}

Enemy_easy.prototype = Object.create(Enemy.prototype);
Enemy_easy.prototype.constructor = Enemy_easy;
