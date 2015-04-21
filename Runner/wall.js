var wall_vars = {
	framesSinceLastWall: 0,
	y: 0,
	w: 0,
	h: 0,
	indexes: [],
}

function wallGenerator(){
	wall_vars.framesSinceLastWall ++;
	if(wall_vars.framesSinceLastWall == 45){
		wall_vars.y = player.y+rand_i(-120,120)
		wall_vars.w = 20+Math.floor(Math.random()*40)
		wall_vars.h = 20+Math.floor(Math.random()*40)

		new Wall(500,wall_vars.y,wall_vars.w,wall_vars.h);
		wall_vars.framesSinceLastWall = 0;
	}
}

function Wall(x,y,w,h){
	walls.push(this);
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	this.onScreen = true;

	for(var i=0; i<coins.length; i++){
		var x2 = this.x + (this.w/2);
		var y2 = this.y + (this.h/2);
		var dist2 = (this.w/2)*(this.w/2) + (this.h/2)*(this.h/2);

		var dx = coins[i].x - x2;
		var dy = coins[i].y - y2;
		var dist1 = dx*dx + dy*dy;
		//dist1 += dist2;

		if(dist1 < 55*55 + dist2){
			coins[i].onScreen = false;
			coins[i].touchable = false;
		}
	}
}
Wall.prototype.touched = function(){
	//sounds.play(sounds.hitWall)
	player.gotHit(player.hp);
}
Wall.prototype.animate = function(){
	this.x -= 6;
	if(this.x + this.w < 0){
		this.onScreen = false;
	}
};
Wall.prototype.render = function(){
	if(this.onScreen){
		ctx.fillStyle = "brown";
		ctx.fillRect(this.x,this.y,this.w,this.h);

		//ctx.drawImage(this.img,this.game.frameX,this.game.frameY,this.game.frameW,this.game.frameH,this.x,this.y,this.w,this.h)
	}
};
Wall.prototype.gotHit = function(){
	//animate explosion
	del(this)
}