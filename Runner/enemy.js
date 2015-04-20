var enemies = [];
var projectiles = [];

var enemy_vars = {
	framesSinceLastEnemy: 0,
}
function enemyGenerator(){
	if((game.frame > 900 || player.points > 50) &&
	enemy_vars.framesSinceLastEnemy > 600){
		new BasicEnemy(rand_i(320,455),rand_i(0,295),25,25);
		enemy_vars.framesSinceLastEnemy = 0;
	}
	enemy_vars.framesSinceLastEnemy ++;
}

function Enemy(x,y,w,h){
	enemies.push(this);
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

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
		var a = new Coin(this.x,this.y,this.worth);
		a.magnet = true;
		del(this);
	}
}
function BasicEnemy(x,y,w,h){
	Enemy.call(this,x,y,w,h);
	
	this.maxVel = 5;
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
		new Projectile(this.x,this.y,10,10,dx,dy,1,6,player)
	}
}

BasicEnemy.prototype = Object.create(Enemy.prototype);
BasicEnemy.prototype.constructor = BasicEnemy;


function Projectile(x,y,w,h,dx,dy,dmg,spd,targets){
	projectiles.push(this);
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.dx = dx;
	this.dy = dy;
	this.dmg = dmg;
	this.spd = spd;
	this.targets = targets;
	this.onScreen = true;
}
Projectile.prototype.animate = function(){
	if(!willCollide(this,this.dx,this.dy,walls)){
		this.x += this.dx*this.spd;
		this.y += this.dy*this.spd;
	}
	else{del(this)}
	if(this.targets[0] === undefined){
		if(willCollide(this,this.dx,this.dy,this.targets)){
			this.targets.gotHit(this.dmg);
			del(this);
		}
	}
	else{
		for(var i=0; i<this.targets.length; i++){
			var targ = this.targets[i];
			if(willCollide(this,this.dx,this.dy,targ)){
				targ.gotHit(this.dmg);
				del(this);
			}
		}
	}


	if(this.x + this.w < 0 || this.x > 480 || this.y + this.h < 0 || this.y > 320){
		this.onScreen = false;
		del(this)
	}
	else{this.onScreen = true;}
	
}
Projectile.prototype.render = function(){
	if(!this.onScreen){return;}
	ctx.fillRect(this.x,this.y,this.w,this.h)
}
