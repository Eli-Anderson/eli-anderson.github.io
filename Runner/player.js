var player = {
	x: 10,
	w: 30,
	h: 30,
	y: 140,
	dy: 0,
	ddy: 0,
	maxVel: 5,
	points: 0,
	totalPoints: 0,
	framesSinceLastShot: 0,
	framesPerShot: 60,
	hp: 3,
	r: 0,
	g: 0,
	b: 0,
	animate: function(){
		this.framesSinceLastShot ++;
	    if(game.awaitingInput){
	        return;
	    }
		if(this.hp === 0){this.gameOver();}
		if(Math.abs(this.dy) < 0.01){this.dy = 0}
		if(input.up){
			this.ddy = -0.25;
		}
		else if(input.down){
			this.ddy = 0.25;
		}
		else{this.ddy = 0}
		if(Math.abs(this.dy + this.ddy) < this.maxVel){
			this.dy += this.ddy;
		}
		
		this.y += this.dy;
		
		this.ddy *= 0.95;
		this.dy *= 0.95;
		
		this.r = 120+ 20*Math.round(this.dy);
	},
	render: function(){
		ctx.fillStyle = "rgb("+this.r+","+this.g+","+this.b+")";
		ctx.fillRect(this.x,this.y,this.w,this.h);
		//ctx.drawImage(this.spriteSheet,this.game.frameX,this.game.frameY,
		//              this.x,this.y,this.game.frameW,this.game.frameH)
	},
	willCollide: function(obj){
		var p = player;
			var c = obj;
			if(p.x+p.w > c.x &&
				p.x < c.x+c.w &&
				p.y+p.h > c.y &&
				p.y < c.y+c.h){
					return true
				}
			else{return false}
	},
	checkCollisions_coins: function(){
		for(var i=0; i<coins.length; i++){
			if(this.willCollide(coins[i]) && coins[i].touchable){
				coins[i].touched();
			}
		}
	},
	checkCollisions_walls: function(){
		for(var i=0; i<walls.length; i++){
			if(this.willCollide(walls[i])){
				walls[i].touched();
			}
		}
	},
	fire: function(){
		if(this.framesPerShot - this.framesSinceLastShot <= 0 && !game.awaitingInput){
			new Projectile(this.x,this.y,10,10,1,0,1,12,enemies);
			this.framesSinceLastShot = 0;
		}
	},
	gotHit: function(dmg){
		this.hp -= dmg;
	},
	gameOver: function(){
		game.running = false;
		button_left = null;
		button_right = null;
		animLoseScreen();
	}
}