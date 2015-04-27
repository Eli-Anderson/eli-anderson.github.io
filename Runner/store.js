var unpause_timeout;
var countdown_timeout;
var store = {
	open: function(){

	},
	animate_open: function(){
		clearTimeout(unpause_timeout);
		clearTimeout(countdown_timeout);
		Howler.volume(.5);
		menus = [];
		buttons = [];
		texts = [];
		var menu1 = new Menu(20,-320,440,280,[180,180,180,1]);
		menu1.dx = 0;
		menu1.dy = 17;
		menu1.animate = function(){
			this.x += this.dx;
			this.y += this.dy;
			this.dx *= 0.95;
			this.dy *= 0.95;
		};

		for(var i=1; i<5; i++){
			var menu2 = new Menu(60*i + 40*(i-1) - 10,-280,80,80,[255,255,255,1]);
			menu2.dx = 0;
			menu2.dy = 17;
			menu2.animate = function(){
				this.x += this.dx;
				this.y += this.dy;
				this.dx *= 0.95;
				this.dy *= 0.95;
			};
			var topRowButton = new Button(60*i + 40*(i-1) - 10,60,80,80)
			topRowButton.n = (i-1);
			topRowButton.onLift = function(){
				store.purchase(store.items[this.n]);
			}


			var menu3 = new Menu(60*i + 40*(i-1) - 10,-180,80,80,[255,255,255,1]);
			menu3.dx = 0;
			menu3.dy = 17;
			menu3.animate = function(){
				this.x += this.dx;
				this.y += this.dy;
				this.dx *= 0.95;
				this.dy *= 0.95;
			};
			var bottomRowButton = new Button(60*i + 40*(i-1) - 10,160,80,80)
			bottomRowButton.n = (i-1+4);
			bottomRowButton.onLift = function(){
				store.purchase(store.items[this.n]);
			}
		};
		var menu_back = new Menu(20,-90,120,50,[255,255,255,1]);
			menu_back.dx = 0;
			menu_back.dy = 17;
			menu_back.animate = function(){
				this.x += this.dx;
				this.y += this.dy;
				this.dx *= 0.95;
				this.dy *= 0.95;
			};
		var back = new Button(20,250,120,50);
		back.onLift = function(){
			//exit store
			store.animate_close();
		}
		var menu_next = new Menu(340,-90,120,50,[255,255,255,1]);
			menu_next.dx = 0;
			menu_next.dy = 17;
			menu_next.animate = function(){
				this.x += this.dx;
				this.y += this.dy;
				this.dx *= 0.95;
				this.dy *= 0.95;
			};
		var nextPage = new Button(340,250,120,50);
		nextPage.onLift = function(){
			//flip to next page
			console.error("To be updated...");
		}
	},
	animate_close: function(){
		for(var i=0; i<menus.length; i++){
			menus[i].dy = -17;
		}
		buttons = [];
		setTimeout(function(){
			menus = [];
			button_left = new Button(0,0,240,320);
			button_left.onTouch = function(){
				input.up = true;
			}
			button_left.onLift = function(){
				input.up = false;
			}
			button_right = new Button(240,80,240,320);
			button_right.onTouch = function(){
				player.fire();
			}
			store_button = new Button(400,0,80,60);
			store_button.onLift = function(){
				game.pause();
				store.animate_open();
			}
			inventory_button = new Button(0,0,80,60);
			inventory_button.onLift = function(){
				game.pause();
				inventory.animate_open();
			};
			text_score = new Text(-100,30,player.points,"32px Georgia",[255,255,255,1])
			text_score.dx = 50;
			text_score.dy = 0;
			text_score.animate = function(){
				this.x += this.dx;
				this.y += this.dy;
				this.dx *= 0.9;
				this.dy *= 0.9;
			};
		},750);
		game.trigger1Fired = false;
		Howler.volume(1);
		countdown_timeout = setTimeout(function(){sound.play(sound.list.countdown)},0);
		countdown_timeout = setTimeout(function(){sound.play(sound.list.countdown)},1000);
		countdown_timeout = setTimeout(function(){sound.play(sound.list.countdown)},2000);
		unpause_timeout = setTimeout(function(){game.unpause();},3000);
	},

	items: [weapons._default,weapons._rocket,weapons._plasma,"d","e","f","g","h"],
	purchase: function(item){
		//console.error("Purchased item "+item);
		if(player.points >= item.purchaseCost){
			item.ammo ++;
			player.points -= item.purchaseCost;
			player.spentPoints += item.purchaseCost;
			sound.play(sound.list.purchase);
		}
		else{
			sound.play(sound.list.err);
		}
	}

}