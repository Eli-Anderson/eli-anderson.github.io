var inventory = {
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
			var topRowMenu = new Menu(60*i + 40*(i-1) - 10,-280,80,80,[255,255,255,1]);
			topRowMenu.dx = 0;
			topRowMenu.dy = 17;
			topRowMenu.animate = function(){
				this.x += this.dx;
				this.y += this.dy;
				this.dx *= 0.95;
				this.dy *= 0.95;
			};
			var topRowButton = new Button(60*i + 40*(i-1) - 10,60,80,80)
			topRowButton.n = (i-1);
			topRowButton.onLift = function(){
				inventory.equip(inventory.items[this.n]);
			}
			if(inventory.items[i-1] != undefined){
				var ammo = inventory.items[i-1].ammo;
				var len = ammo.toString().length;
			}
			else{var ammo = 0; var len = 1}
			var topRowText = new Text(60*i + 40*(i-1) - 10 -5*(len-1) + 35,-205,ammo,"16px Georgia",[0,0,0,1])
			topRowText.dx=0;
			topRowText.dy=17;
			topRowText.animate = function(){
				this.x += this.dx;
				this.y += this.dy;
				this.dx *= 0.95;
				this.dy *= 0.95;
			};

			var bottomRowMenu = new Menu(60*i + 40*(i-1) - 10,-180,80,80,[255,255,255,1]);
			bottomRowMenu.dx = 0;
			bottomRowMenu.dy = 17;
			bottomRowMenu.animate = function(){
				this.x += this.dx;
				this.y += this.dy;
				this.dx *= 0.95;
				this.dy *= 0.95;
			};
			var bottomRowButton = new Button(60*i + 40*(i-1) - 10,160,80,80)
			bottomRowButton.n = (i-1+4);
			bottomRowButton.onLift = function(){
				inventory.equip(inventory.items[this.n]);
			}
			if(inventory.items[i-1+4] != undefined){
				var ammo = inventory.items[i-1+4].ammo;
				var len = ammo.toString().length;
			}
			else{var ammo = 0; var len = 1}
			var bottomRowText = new Text(60*i + 40*(i-1) - 10 -5*(len-1) + 35,-105,ammo,"16px Georgia",[0,0,0,1])
			bottomRowText.dx=0;
			bottomRowText.dy=17;
			bottomRowText.animate = function(){
				this.x += this.dx;
				this.y += this.dy;
				this.dx *= 0.95;
				this.dy *= 0.95;
			};
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
			//exit inventory
			inventory.animate_close();
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
		for(var n=0; n<texts.length; n++){
			texts[n].dy = -17;
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
			};
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
	items: [weapons._default,weapons._rocket,weapons._plasma],
	equip: function(item){
		player.weapon = item;
	}
}