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
	hp: 3,
	r: 0,
	g: 0,
	b: 0,
	animate: function(){
	    if(game.awaitingInput){
	        return;
	    }
		if(player.hp === 0){player.gameOver();}
		if(Math.abs(this.dy) < 0.01){this.dy = 0}
		if(input.up){
			player.ddy = -0.25;
		}
		else if(input.down){
			player.ddy = 0.25;
		}
		else{player.ddy = 0}
		if(Math.abs(player.dy + player.ddy) < player.maxVel){
			player.dy += player.ddy;
		}
		
		player.y += player.dy;
		
		player.ddy *= 0.95;
		player.dy *= 0.95;
		
		player.r = 120+ 20*Math.round(player.dy);
	},
	render: function(){
		ctx.fillStyle = "rgb("+player.r+","+player.g+","+player.b+")";
		ctx.fillRect(player.x,player.y,player.w,player.h);
		//ctx.drawImage(player.spriteSheet,player.game.frameX,player.game.frameY,
		//              player.x,player.y,player.game.frameW,player.game.frameH)
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
			if(player.willCollide(coins[i]) && coins[i].touchable){
				coins[i].touched();
			}
		}
	},
	checkCollisions_walls: function(){
		for(var i=0; i<walls.length; i++){
			if(player.willCollide(walls[i])){
				walls[i].touched();
			}
		}
	},
	fire: function(){
		var dx = player.x - this.x;
		new Projectile(this.x,this.y,10,10,1,0,1,12,enemies)
	},
	gotHit: function(dmg){
		player.hp -= dmg;
	},
	gameOver: function(){
		game.running = false;
		button_left = null;
		button_right = null;
		animLoseScreen();
	}
}