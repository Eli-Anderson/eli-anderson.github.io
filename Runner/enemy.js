var enemies = [];

var enemy_vars = {
	framesSinceLastEnemy: 0,
	frame: 0,
	framesPerEnemy: 300,
	options: [
		function(){new Enemy_easy(rand_i(320,455),rand_i(0,295));},
	],

}
/*
  seconds  -- frames
		1  -- 60
		2  -- 120
		3  -- 180
		4  -- 240
		5  -- 300
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
	if(f == 1){enemy_vars.options = [function(){new Enemy_easy(rand_i(320,455),rand_i(0,295));},]}
	if(f == 1800){
		enemy_vars.options.push(function(){new Enemy_medium(rand_i(320,455),rand_i(0,295));})
	}

	if(enemy_vars.framesSinceLastEnemy < enemy_vars.framesPerEnemy){ return; }
	if(f > 300){
		rand_a(enemy_vars.options)();
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
		rand_a(this.drops)()
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
	var that = this;
	this.drops = [
		function(){new HealthUpgrade(that.x,that.y,rand_i(1,3))},
		function(){new RocketLauncherUpgrade(that.x,that.y,3)},
		function(){new Orb(that.x,that.y,rand_i(5,10))},
	];

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
	var that = this;
	this.drops = [
		function(){new HealthUpgrade(that.x,that.y,1)},
		function(){new RocketLauncherUpgrade(that.x,that.y,1)},
		function(){new Orb(that.x,that.y,rand_i(1,3))},
	]
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
