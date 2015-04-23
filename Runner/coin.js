var coin_vars = {
	framesSinceLastCoin: 0,
	y: 0,
	theda: 0,
	y_scaler: 110,
	counter: 0,
}

function coinGenerator(){
	coin_vars.framesSinceLastCoin ++;
	if(coin_vars.framesSinceLastCoin == 60){
		if(coin_vars.y_scaler >= 150){
			coin_vars.y_scaler *= rand_d(0.9,1);
		}
		else{coin_vars.y_scaler *= rand_d(0.9,1.1);}
	    coin_vars.y = 160+coin_vars.y_scaler*Math.sin(coin_vars.theda);
		new Coin(500,coin_vars.y,1);
		coin_vars.framesSinceLastCoin = 0;
		coin_vars.theda += Math.PI/8;
		coin_vars.counter ++;
	}
}
function Coin(x,y,p){
	coins.push(this);
	this.x = x;
	this.y = y;
	this.points = p;
	this.w = 15;
	this.h = 15;

	this.dx = -6;
	this.dy = 0;

	this.maxVel = 6;

	this.magnet = false;

	this.onScreen = true;
	this.touchable = true;
}
Coin.prototype.touched = function(){
	del(this);
	player.points += this.points;
	text_score.txt += this.points;
	sound.play(sound.list.coin_pickup,2);
}
Coin.prototype.animate = function(){
	this.dx = -6;
	this.dx *= game.global_dxdy;
	this.dy *= game.global_dxdy;
	this.x += this.dx;
	this.y += this.dy;

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
var coinImage = new Image();
coinImage.src = "coin_01.png";
Coin.prototype.render = function(){
	if(!this.onScreen){return}
	//ctx.fillStyle = "yellow";
	//ctx.fillRect(this.x,this.y,this.w,this.h)
	ctx.drawImage(coinImage,this.x,this.y,this.w+4,this.h+4)
}