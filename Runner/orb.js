var orb_vars = {
	framesSinceLastOrb: 0,
	y: 0,
	theda: 0,
	y_scaler: 110,
	counter: 0,
}

function orbGenerator(){
	orb_vars.framesSinceLastOrb ++;
	if(orb_vars.framesSinceLastOrb == 60){
		if(orb_vars.y_scaler >= 150){
			orb_vars.y_scaler *= rand_d(0.9,1);
		}
		else{orb_vars.y_scaler *= rand_d(0.9,1.1);}
	    orb_vars.y = 160+orb_vars.y_scaler*Math.sin(orb_vars.theda);
		new Orb(500,orb_vars.y,1);
		orb_vars.framesSinceLastOrb = 0;
		orb_vars.theda += Math.PI/8;
		orb_vars.counter ++;
	}
}
function Orb(x,y,p){
	orbs.push(this);
	this.x = x;
	this.y = y;
	this.points = p;
	this.w = 20;
	this.h = 20;

	this.dx = -6;
	this.dy = 0;

	this.maxVel = 6;

	this.magnet = false;

	this.onScreen = true;
	this.touchable = true;

	this.frameX = 168;
	this.frameY = 8;
	this.frameW = 18;
	this.frameH = 20;

	this.alpha = 1;
	this.counter = rand_a([Math.PI/4,Math.PI/2,Math.PI]);
}
Orb.prototype.touched = function(){
	del(this,orbs);
	player.points += this.points;
	sound.play(sound.list.orb_pickup,2);
}
Orb.prototype.animate = function(){
	this.counter += Math.PI/60;
	this.dx = -6;
	this.dx *= game.global_dxdy;
	this.dy *= game.global_dxdy;
	this.x += this.dx;
	this.y += this.dy;

	this.alpha = Math.sin(this.counter);
	

	if(this.magnet){
		if(Math.abs(this.dy) < this.maxVel){
			this.dy += (player.y - this.y)/Math.abs(player.y - this.y)
		}
	}
	this.dy *= 0.9;

	if(this.x < -20){
		this.onScreen = false;
	}
	
}
Orb.prototype.render = function(){
	if(!this.onScreen){return}
	//ctx.fillStyle = "yellow";
	//ctx.fillRect(this.x,this.y,this.w,this.h);
	ctx.save();
	ctx.globalAlpha = this.alpha;
	ctx.drawImage(projectile_img,this.frameX,this.frameY,this.frameW,this.frameH,this.x,this.y,this.w,this.h);
	ctx.restore();
}
