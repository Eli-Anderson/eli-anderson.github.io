var enemies = [];

var enemy_vars = {
	framesSinceLastEnemy: 0,
}
function enemyGenerator(){
	if((game.frame > 900 || player.points > 50) &&
	enemy_vars.framesSinceLastEnemy > 600){
		new Enemy_easy(rand_i(320,455),rand_i(0,295));
		enemy_vars.framesSinceLastEnemy = 0;
	}
	enemy_vars.framesSinceLastEnemy ++;
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
		ctx.fillRect(this.x,this.y,this.w,this.h);
	}
}
Enemy.prototype.gotHit = function(dmg){
	this.hp -= dmg;
	if(this.hp <= 0){
		//animate death
		//drop coins or upgrades
		var x = this.x;
		var y = this.y;
		rand_a([
					function(){new HealthUpgrade(x,y,20,20,1)},
					function(){new RocketLauncherUpgrade(x,y,20,20,3)},
					function(){new Coin(x,y,5)},
				])()
		del(this);
	}
}

function BasicEnemy(x,y){
	Enemy.call(this,x,y);
	
	this.w = 20;
	this.h = 20;

	this.maxVel = 3;
	this.framesPerShot = 90;
	this.hp = 1;
	this.worth = 3;
	
	this.animate = function(){
		var dist = player.y - this.y;
		if(Math.abs(this.dy) < this.maxVel){
			this.dy += dist/Math.abs(dist);
		}
		if(!willCollide(this,this.dx,this.dy,walls)){
			this.y += this.dy;
		}
		this.dy *= 0.99;
		
		if((game.frame - this.frame) % this.framesPerShot == 0 && !game.awaitingInput){this.fire()}
	};
	this.fire = function(){
		var dx = player.x - this.x;
		var dy = player.y - this.y;
		var dist = Math.sqrt(dx*dx+dy*dy);
		dx/=dist;
		dy/=dist;
		new Projectile_basic(this.x,this.y,-1,0,player);
	}
}
BasicEnemy.prototype = Object.create(Enemy.prototype);
BasicEnemy.prototype.constructor = BasicEnemy;

function Enemy_easy(x,y){
	Enemy.call(this,x,y);
	
	this.w = 25;
	this.h = 25;

	this.maxVel = 3;
	this.framesPerShot = 90;
	this.hp = 1;
	this.worth = 3;
	this.counter = (this.y/(320-this.h))*Math.PI*2;
	this.dy = 0;
	this.friction = .99;
	
	this.animate = function(){
		this.dy = Math.sin(this.counter)
		if(!willCollide(this,this.dx,this.dy,walls)){
			this.y += 4*this.dy;
		}
		//this.dy *= this.friction;
		
		if((game.frame - this.frame) % this.framesPerShot == 0 && !game.awaitingInput){this.fire()}
		this.counter += Math.PI/128
	};
	this.fire = function(){
		new Projectile_basic(this.x,this.y,-1,0,player);
	}
}

Enemy_easy.prototype = Object.create(Enemy.prototype);
Enemy_easy.prototype.constructor = Enemy_easy;
