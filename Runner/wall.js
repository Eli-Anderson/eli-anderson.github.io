
var wall_vars = {
	framesSinceLastWall: 0,
	y: 0,
	framesPerWall: 120,
}

function wallGenerator(){
	wall_vars.framesSinceLastWall ++;
	if(wall_vars.framesSinceLastWall >= wall_vars.framesPerWall){
		wall_vars.y = player.y+rand_i(-120,120)
		wall_vars.w = 20+Math.floor(Math.random()*40)
		wall_vars.h = 20+Math.floor(Math.random()*40)

		new Wall(1000,wall_vars.y);
		wall_vars.framesSinceLastWall = 0;
	}
}

function Wall(x,y){
	walls.push(this);
	this.x = x;
	this.y = y;
	this.r = 25;
	
	this.dx = 0;
	this.dy = 0;

	this.ddx = -6;
	this.ddy = 0;

	this.frameX = 0;
	this.frameY = 0;
	this.frameW = 120;
	this.frameH = 120;
	this.frameCounter = 0;

	this.onScreen = true;

	for(var i=0; i<orbs.length; i++){
		var x2 = this.x
		var y2 = this.y

		var dx = orbs[i].x - x2;
		var dy = orbs[i].y - y2;
		var dist1 = dx*dx + dy*dy;
		//dist1 += dist2;

		if(dist1 < 55*55){
			orbs[i].onScreen = false;
			orbs[i].touchable = false;
		}
	};
	this.dc = rand_a([-1,1]);
	this.spin = function(){
		if(this.frameCounter >= 0 && this.frameCounter <= 15){
			this.frameCounter += this.dc;
		}
		else if(this.frameCounter < 0){
			this.frameCounter = 15;
		}
		else{this.frameCounter = 0}
	}
}
Wall.prototype.touched = function(){
	//sounds.play(sounds.hitWall)
	player.gotHit(player.hp);
}
Wall.prototype.animate = function(){
	if(Math.abs(this.dx + this.ddx) <= 6){
		this.dx += this.ddx;
	}
	this.dy += this.ddy;
	this.dx *= game.global_dxdy;
	this.dy *= game.global_dxdy;
	this.x += this.dx;
	this.y += this.dy;
	if(this.x + this.r < 0){
		this.onScreen = false;
	};
};

Wall.prototype.render = function(){
	if(this.onScreen){
		//ctx.drawImage(asteroid_img,this.x-60,this.y-60)
		if(game.frame % 5 == 0){
			this.spin();
		}
			switch(this.frameCounter){
				case 0:
					this.frameX = 0;
					this.frameY = 0;
					break;
				case 1:
					this.frameX = 121;
					this.frameY = 0;
					break;
				case 2:
					this.frameX = 0;
					this.frameY = 121;
					break;
				case 3:
					this.frameX = 121;
					this.frameY = 121;
					break;
				case 4:
					this.frameX = 242;
					this.frameY = 0;
					break;
				case 5:
					this.frameX = 242;
					this.frameY = 121;
					break;
				case 6:
					this.frameX = 363;
					this.frameY = 0;
					break;
				case 7:
					this.frameX = 363;
					this.frameY = 121;
					break;
				case 8:
					this.frameX = 0;
					this.frameY = 242;
					break;
				case 9:
					this.frameX = 0;
					this.frameY = 363;
					break;
				case 10:
					this.frameX = 121;
					this.frameY = 242;
					break;
				case 11:
					this.frameX = 242;
					this.frameY = 242;
					break;
				case 12:
					this.frameX = 121;
					this.frameY = 363;
					break;
				case 13:
					this.frameX = 242;
					this.frameY = 363;
					break;
				case 14:
					this.frameX = 363;
					this.frameY = 242;
					break;
				case 15:
					this.frameX = 363;
					this.frameY = 363;
					break;
			}
		ctx.drawImage(asteroid_img,this.frameX,this.frameY,this.frameW,this.frameH,
			this.x-60,this.y-60,this.frameW,this.frameH);
	}
};
Wall.prototype.gotHit = function(){
	del(this,walls)
}
