var enemies = [];
var projectiles = [];

var enemy_vars = {
	framesSinceLastEnemy: 0,
}
function enemyGenerator(){
	if((game.frame > 900 || player.points > 50) &&
	enemy_vars.framesSinceLastEnemy > 600){
		//new BasicEnemy(rand_i(320,455),rand_i(0,295),25,25);
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
	
	this.frame = game.frame;

}
Enemy.prototype.render = function(){
	ctx.fillRect(this.x,this.y,this.w,this.h);
}
function BasicEnemy(x,y,w,h){
	Enemy.call(this,x,y,w,h);
	
	this.maxVel = 5;
	this.framesPerShot = 90;
	
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
	}
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



function Projectile(x,y,w,h,dx,dy,dmg,spd,target){
	projectiles.push(this);
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.dx = dx;
	this.dy = dy;
	this.dmg = dmg;
	this.spd = spd;
	this.target = target;
	this.onScreen = true;
}
Projectile.prototype.animate = function(){
	if(!willCollide(this,this.dx,this.dy,walls)){
		this.x += this.dx*this.spd;
		this.y += this.dy*this.spd;
	}
	else{del(this)}
	if(willCollide(this,this.dx,this.dy,this.target)){
		this.target.gotHit(this.dmg);
		del(this);
	}
	if(this.x + this.w < 0 || this.x > 480 || this.y + this.h < 0 || this.y > 0){
		this.onScreen = false;
	}
	else{this.onScreen = true;}
	
}
Projectile.prototype.render = function(){
	if(!this.onScreen){return;}
	ctx.fillRect(this.x,this.y,this.w,this.h)
}
