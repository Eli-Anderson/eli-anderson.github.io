var upgrades = [];

function Upgrade(x,y,w,h){
	upgrades.push(this);

	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	this.onScreen = true;
}
Upgrade.prototype.render = function(){
	if(this.onScreen){
		ctx.fillRect(this.x,this.y,this.w,this.h);
	}
}
Upgrade.prototype.animate = function(){
	if(willCollide(this,-6,0,player)){
		this.onCollide();
	}
	this.x -= 6;
}
Upgrade.prototype.onCollide = function(){
}

function HealthUpgrade(x,y,w,h,amt){
	Upgrade.call(this,x,y,w,h);
	this.hp = amt;

	this.onCollide = function(){
		player.hp += this.hp;
		del(this);
		sound.play(sound.list.heart_pickup,0)
	}
}

HealthUpgrade.prototype = Object.create(Upgrade.prototype);
HealthUpgrade.prototype.constructor = HealthUpgrade;

var asdf = new HealthUpgrade(0,0,0,0,1);