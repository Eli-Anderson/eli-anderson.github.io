var explosions = [];
var explosion_img = new Image();
explosion_img.src = "explosion.png"
function Explosion(x,y,w,h){
	explosions.push(this)
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

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

	this.x -= 6;
}
Explosion.prototype.render = function(){
	ctx.drawImage(explosion_img,this.frameX,this.frameY,96,96,this.x-(this.w/2),this.y-(this.h/2),this.w,this.h)
}