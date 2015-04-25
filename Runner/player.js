var player_img = new Image();
player_img.src = "Ship/spritesheet.png"
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
	onScreen: true,
	
	frameX: 410,
	frameY: 0,
	frameW: 80,
	frameH: 87,
	
	sprite: {
		"-5": {x: 0, y:0, w: 82, h: 80},
		"-4": {x: 82, y:0, w: 82, h: 82},
		"-3": {x: 164, y:0, w: 82, h: 84},
		"-2": {x: 246, y:0, w: 82, h: 86},
		"-1": {x: 328, y:0, w: 82, h: 86},
		"0": {x: 410, y:0, w: 80, h: 87},
		"1": {x: 490, y:0, w: 81, h: 86},
		"2": {x: 571, y:0, w: 82, h: 86},
		"3": {x: 653, y:0, w: 82, h: 84},
		"4": {x: 735, y:0, w: 82, h: 82},
		"5": {x: 817, y:0, w: 82, h: 80},
	},
	
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
		this.ddy *= game.global_dxdy;
		if(Math.abs(this.dy + this.ddy) < this.maxVel){
			this.dy += this.ddy;
		}
		this.dy *= 0.95;
		this.y += this.dy;
		
		this.ddy *= 0.95;

		if((this.y+this.h < 0 || this.y > 320) && game.frame % 60 == 0){
			this.gotHit(1);
		}
		if(game.frame % 1 == 0){
			var s = Math.round(this.dy).toString()
			this.frameX = this.sprite[s].x;
			this.frameW = this.sprite[s].w;
			this.frameH = this.sprite[s].h;
		}
	},
	render: function(){
		if(this.onScreen){
			ctx.drawImage(player_img,this.frameX,this.frameY,this.frameW,this.frameH,this.x,this.y,this.w,this.h);
		}
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
	checkCollisions_orbs: function(){
		for(var i=0; i<orbs.length; i++){
			if(this.willCollide(orbs[i]) && orbs[i].touchable){
				orbs[i].touched();
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
			new Explosion(this.x+this.w/2,this.y+this.h/2,50,50)
		}
		else{
			sound.play(sound.list.player_hit);
		}
	},
	gameOver: function(){
		sound.play(sound.list.player_killed);
		this.onScreen = false;
		game.running = false;
		button_left = null;
		button_right = null;
		game.global_dxdy = 0;
		setTimeout(function(){
			animLoseScreen();
		}, 1500)
	},
	weapon: _default,
}
