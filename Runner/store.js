var unpause_timeout;
var countdown_timeout;


var store_upgrades = {
	shield: {
		purchaseCost: 15,
		purchased: function(){
			player.shield ++;
		}
	},
	health: {
		purchaseCost: 10,
		purchased: function(){
			player.hp ++;
		}
	},
	rate_of_fire: {
		purchaseCost: 5,
		purchased: function(){
			this.purchaseCost ++;
			for(var i in weapons){
				weapons[i].framesPerShot -= Math.ceil(weapons[i].framesPerShot/10)
			}
		}
	}
}


var store = {
	open: function(){

	},
	animate_open: function(){
		clearTimeout(unpause_timeout);
		clearTimeout(countdown_timeout);
		game.pause()
		Howler.volume(.5);
		menus   = [];
		buttons = [];
		texts   = [];

		for(var i=0; i<3; i++){
			var image_background = new Menu(50+ (i*130),-250,120,120,[220,220,220,.7]);
			image_background.dx  = 0;
			image_background.dy  = 17;
		};
		var text1 = new Text(85,-180,"SPEED","16px Georgia",[0,255,0,1]);
		var text2 = new Text(218,-180,"LUCK","16px Georgia",[255,255,51,1]);
		var text3 = new Text(352,-180,"LIFE","16px Georgia",[255,0,0,1]);
		text1.dy = text2.dy = text3.dy = 17;
		setTimeout(function(){
			var button1 = new Button(50,90,120,120);
			button1.onLift = function(){
				for(var i in weapons){
					weapons[i].framesPerShot -= Math.ceil(weapons[i].framesPerShot/7);
				}
				store.animate_close();
			};
			var button2 = new Button(180,90,120,120);
			button2.onLift = function(){
					player.luck += .25;
					store.animate_close();
			};
			var button3 = new Button(310,90,120,120);
			button3.onLift = function(){
				player.hp += 3;
				store.animate_close();
			};
		},1000)
	},
	animate_close: function(){
		for(var i=0; i<menus.length; i++){
			menus[i].dy = -17;
		}
		buttons = [];
		texts = [];
		setTimeout(function(){
			menus = [];
			setGameButtons();
			text_score    = new Text(-100,30,player.points,"32px Georgia",[255,255,255,1])
			text_score.dx = 50;
			text_score.dy = 0;
			text_score.animate = function(){
				this.x  += this.dx;
				this.y  += this.dy;
				this.dx *= 0.9;
				this.dy *= 0.9;
			};
		},750);
		game.trigger1Fired = false;
		Howler.volume(1);
		countdown_timeout = setTimeout(function(){sound.play(sound.list.countdown)},0);
		countdown_timeout = setTimeout(function(){sound.play(sound.list.countdown)},1000);
		countdown_timeout = setTimeout(function(){sound.play(sound.list.countdown)},2000);
		unpause_timeout   = setTimeout(function(){game.unpause();},3000);
	},

	items: [
		weapons._default,
		weapons._rocket,
		weapons._plasma,
		store_upgrades.health,
		store_upgrades.shield,
	],
	purchase: function(item){
		//console.error("Purchased item "+item);
		if(player.points >= item.purchaseCost){
			item.purchased();
			player.points      -= item.purchaseCost;
			player.spentPoints += item.purchaseCost;
			sound.play(sound.list.purchase);
		}
		else{
			sound.play(sound.list.err);
		}
	}
}