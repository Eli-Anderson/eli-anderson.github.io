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
		//ctx.fillRect(this.x,this.y,this.w,this.h);
		ctx.drawImage(this.img,this.imgFrameX,this.imgFrameY,this.imgW,this.imgH,this.x,this.y,this.w,this.h);
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
	this.img = heart_img;
	this.imgW = heart_img.width;
	this.imgH = heart_img.height;
	this.imgFrameX = 0;
	this.imgFrameY = 0;

	this.onCollide = function(){
		player.hp += this.hp;
		del(this);
		sound.play(sound.list.heart_pickup,0);
	}
}

HealthUpgrade.prototype = Object.create(Upgrade.prototype);
HealthUpgrade.prototype.constructor = HealthUpgrade;
var rocket_img = new Image();
rocket_img.src = "icons.png"

function RocketLauncherUpgrade(x,y,w,h,amt){
	Upgrade.call(this,x,y,w,h);
	this.duration = amt;
	this.img = rocket_img;
	this.imgW = 16;
	this.imgH = 16;
	this.imgFrameX = 51;
	this.imgFrameY = 23;
	this.onCollide = function(){
		_rocket.shotsLeft = this.duration;
		player.weapon = _rocket;
		del(this);
		sound.play(sound.list.rocket_pickup,2);
	}
}
RocketLauncherUpgrade.prototype = Object.create(Upgrade.prototype);
RocketLauncherUpgrade.prototype.constructor = RocketLauncherUpgrade;




var _rocket = {
	framesPerShot: 120,
	framesSinceLastShot: 120,
	shotsLeft: 3,
	fire: function(){
		if(this.framesPerShot - this.framesSinceLastShot <= 0 && !game.awaitingInput){
			new Projectile(player.x+player.w/2,player.y+player.h/2,10,10,1,0,10,12,enemies.concat(walls),sound.list.rocket_explosion,30);
			this.framesSinceLastShot = 0;
			this.shotsLeft --;
			sound.play(sound.list.rocket_fire,1)
		}
		if(this.shotsLeft <= 0){
			player.weapon = _default;
		}
	},
}



var _default = {
	framesPerShot: 60,
	framesSinceLastShot: 60,
	shotsLeft: Infinity,
	fire: function(){
		if(this.framesPerShot - this.framesSinceLastShot <= 0 && !game.awaitingInput){
			new Projectile(player.x+player.w/2,player.y+player.h/2,10,10,1,0,1,12,enemies,0,20);
			this.framesSinceLastShot = 0;
			sound.play(sound.list.default_fire,1)
		}
	},
}