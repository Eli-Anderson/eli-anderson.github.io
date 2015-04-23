var player = {
	x: 40,
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
		this.weapon.framesSinceLastShot ++;
	    if(game.awaitingInput){
	        return;
	    }
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


		if((this.y+this.h < 0 || this.y > 320) && game.frame % 60 == 0){
			this.gotHit(1);
		}
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
		if(c.w != undefined){
			if(p.x+p.w > c.x &&
				p.x < c.x+c.w &&
				p.y+p.h > c.y &&
				p.y < c.y+c.h){
					return true
				}
			else{return false}
		}
		else{
			var distX = Math.abs(c.x - this.x-this.w/2);
    		var distY = Math.abs(c.y - this.y-this.h/2);

		    if (distX > (this.w/2 + c.r)) { return false; }
		    if (distY > (this.h/2 + c.r)) { return false; }

		    if (distX <= (this.w/2)) { return true; } 
		    if (distY <= (this.h/2)) { return true; }

		    var dx=distX-this.w/2;
		    var dy=distY-this.h/2;
		    return (dx*dx+dy*dy<=(c.r*c.r));
		}
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
		this.weapon.fire();
	},
	gotHit: function(dmg){
		this.hp -= dmg;
		if(this.hp <= 0){
			this.gameOver();
		}
		else{
			sound.play(sound.list.player_hit);
		}
	},
	gameOver: function(){
		sound.play(sound.list.player_killed);
		game.running = false;
		button_left = null;
		button_right = null;
		animLoseScreen();
	},
	weapon: _default,
}