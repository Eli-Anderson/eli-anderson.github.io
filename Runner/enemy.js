var enemies = [];

var enemy_weapons = {
	basic: {
		framesPerShot: 90,
		fire: function(x,y){
			new Projectile_basic(x,y,-1,0,player);
			//sound.play(sound.list.default_fire);
		},
	},
	rocket: {
		framesPerShot: 90,
		fire: function(x,y){
			new Projectile_rocket(x,y,-1,0,player);
			//sound.play(sound.list.rocket_fire);
		},
	},
	homing_missile: {
		framesPerShot: 120,
		fire: function(x,y){
			new Projectile_homing_missile(x,y,-1,0,player);
			//sound.play(sound.list.rocket_fire);
		},
	},
	laser: {
		framesPerShot: 120,
		fire: function(x,y,angle){
			new Projectile_laser(x,y,angle,player);
			//sound.play(sound.list.rocket_fire);
		},
	}
}
/*
  seconds  -- frames
		1  -- 60
		2  -- 120
		3  -- 180
		4  -- 240
		5  -- 300
		10 -- 600
		15 -- 900
		30 -- 1800
		45 -- 2700
		60 -- 3600

*/
function enemyGenerator(){
	if(game.running_frame == 300){
		waves[1].init();
		wave_time.dy = -5;
		wave_time.txt = game.current_wave * game.difficulty + 10;
		wave_timer.start();
	}
}

function Enemy(x, y){
	enemies.push(this);
	this.x = x;
	this.y = y;


	this.dx = 0;
	this.dy = 0;

	this.onScreen = true;
	
	this.frame = game.frame;

}
Enemy.prototype.render = function(){
	if(this.onScreen){
		//ctx.fillRect(this.x,this.y,this.w,this.h);
		ctx.drawImage(this.img,this.x,this.y,this.w,this.h)
	}
}
Enemy.prototype.gotHit = function(dmg){
	sound.play(this.sound);
	this.hp -= dmg;
	if(this.hp <= 0){
		//animate death
		//drop orbs or upgrades
		//rand_a(this.drops)()
		del(this,enemies);
		effects.ship.large_particle_explosion(this.x,this.y);
	}
}

function Enemy_static(x, y, hp, weapon){
	Enemy.call(this,x,y);
	this.img = enemy_basic_img;
	this.w = 25;
	this.h = 25;

	this.startX = x;

	this.framesPerShot = 90 + rand_i(-15*game.difficulty,15);
	this.weapon = enemy_weapons[weapon] || enemy_weapons.basic;
	this.hp = hp;
	var that = this;
	this.drops = [
		function(){new HealthUpgrade(that.x,that.y,1)},
		function(){new RocketLauncherUpgrade(that.x,that.y,1)},
		function(){new Orb(that.x,that.y,rand_i(1,3))},
	]
	this.sound = sound.list.enemy_easy_hit;
	
	this.animate = function(){
		if(this.startX - this.x < 130){
			this.x --;
		}
		if((game.frame - this.frame) % this.framesPerShot === 0 && !game.awaitingInput){this.fire()}
	};
	this.fire = function(){
		this.weapon.fire(this.x,this.y+this.h/2);
	};
}

Enemy_static.prototype = Object.create(Enemy.prototype);
Enemy_static.prototype.constructor = Enemy_static;

function Enemy_oscillating(x, y, hp, weapon){
	Enemy.call(this,x,y);
	this.img = enemy_basic_img;
	this.w = 25;
	this.h = 25;

	this.startX = x;

	this.weapon = enemy_weapons[weapon] || enemy_weapons.basic;
	this.framesPerShot = 90 + rand_i(-15*game.difficulty,15);
	this.hp = hp;
	var that = this;
	this.drops = [
		function(){new HealthUpgrade(that.x,that.y,1)},
		function(){new RocketLauncherUpgrade(that.x,that.y,1)},
		function(){new Orb(that.x,that.y,rand_i(1,3))},
	]
	this.sound = sound.list.enemy_easy_hit;
	this.counter = 0;
	this.animate = function(){
		if(this.startX - this.x < 130){
			this.x --;
		}
		if((game.frame - this.frame) % this.framesPerShot === 0 && !game.awaitingInput){this.fire()};
		this.dy = 1.5*Math.cos(this.counter);
		this.y += this.dy;
		if(game.frame % 10 == 0){
			this.counter += Math.PI/16;
		}
	};
	this.fire = function(){
		this.weapon.fire(this.x,this.y+this.h/2);
	};
}

Enemy_oscillating.prototype = Object.create(Enemy.prototype);
Enemy_oscillating.prototype.constructor = Enemy_oscillating;

function Enemy_boss(x, y, hp){
	Enemy.call(this,x,y);
	this.img = enemy_basic_img;
	this.w = 125;
	this.h = 125;

	this.startX = x;

	this.weapon = enemy_weapons.laser;
	this.framesPerShot = 240 + rand_i(-15*game.difficulty,15);
	this.hp = hp;
	this.angle_to_player = Math.PI;
	this.laser_angle = Math.PI;
	var that = this;
	this.drops = [
		function(){new HealthUpgrade(that.x,that.y,1)},
		function(){new RocketLauncherUpgrade(that.x,that.y,1)},
		function(){new Orb(that.x,that.y,rand_i(1,3))},
	]
	this.sound = sound.list.enemy_easy_hit;
	this.counter = 0;
	this.animate = function(){
		if(this.startX - this.x < 130){
			this.x -= 0.5;
		}
		if((game.frame - this.frame) % this.framesPerShot === 0 && !game.awaitingInput){this.fire()};
		//this.dy = 1.5*Math.cos(this.counter);
		//this.y += this.dy;
		if(game.frame % 10 == 0){
			this.counter += Math.PI/16;
		};
		var dx = (player.x+player.w/2)-this.x;
		var dy = (this.y+this.h/2)-(player.y+player.h/2);
		var hyp = Math.sqrt((Math.pow(dy,2)) + Math.pow(dx,2))
		this.angle_to_player = Math.PI+Math.asin(dy/hyp)
	}
	this.render = function(){
		if(this.onScreen){
		//ctx.fillRect(this.x,this.y,this.w,this.h);
		ctx.drawImage(this.img,this.x,this.y,this.w,this.h)
	}
		ctx.lineWidth = 1;
		ctx.strokeStyle = "red"
		ctx.beginPath();
		ctx.moveTo(this.x,this.y+this.h/2);
		ctx.lineTo(this.x + 480*Math.cos(this.laser_angle),this.y+this.h/2 + 480*Math.sin(this.laser_angle));
		ctx.stroke();
		ctx.closePath();
	};
	this.fire = function(){
		this.aim();
		var that = this;
		setTimeout(function(){
			that.weapon.fire(that.x,that.y+that.h/2,that.laser_angle);
			that.laser_angle = undefined;
		}, 1000);
	};
	this.aim = function(){
		log(this.angle_to_player)
		this.laser_angle = this.angle_to_player;
	}
}

Enemy_boss.prototype = Object.create(Enemy.prototype);
Enemy_boss.prototype.constructor = Enemy_boss;

var send_next_wave_timeout,wave_completion_check_interval,wave_upgrade_timeout;

var waves = {
	number_of_waves: 7,
	possible_positions: [
		[480,20 ], [530,20 ], [580,20 ],
		[480,70 ], [530,70 ], [580,70 ],
		[480,120], [530,120], [580,120],
		[480,170], [530,170], [580,170],
		[480,220], [530,220], [580,220],
		[480,270], [530,270], [580,270],
	],
	next_wave_frame: 0,
	send_next_wave: function(){
		if(waves[game.current_wave] === undefined){
			game.current_wave = 1;
			game.difficulty ++;
			background.dx = Math.sqrt(game.difficulty);

		}
		wave_time.txt = game.current_wave * game.difficulty + 10;
		if(game.current_wave === 7){
			wave_time.txt = 999;
		}
		wave_check_if_frames_passed.start();
	},
	random_position: function(){
		var r = rand_a(waves.possible_positions);
		for(var i=0; i<waves.possible_positions.length; i++){
			if(waves.possible_positions[i] == r){
				waves.possible_positions.splice(i,1);
			}
		}
		return r;
	},
	send_drops: function(){
		var x = 500;
		var y = player.y + rand_i(-50,50);
		var amt;
		if(Math.random() <= player.luck){
			amt = 2*game.difficulty;
			new HealthUpgrade(x,y,amt);
			sound.play(sound.list.lucky);
			
		}
		else{
			amt = rand_i(game.difficulty,2*game.difficulty);
			rand_a([
			function(){new HealthUpgrade(x,y,amt)},
			function(){new RocketLauncherUpgrade(x,y,amt)},
			function(){new Orb(x,y,amt)},
		])();
		}
	},
	check_if_completed: function(){
		if(enemies[0] == undefined){
			waves[game.current_wave].completed = true;
			clearInterval(wave_completion_check_interval);
			wave_timer.stop();
			wave_time.dy = 5;
			game.current_wave ++;
			waves.next_wave_frame = game.running_frame;
			waves.send_next_wave();
			waves.possible_positions = [
				[480,20 ], [530,20 ], [580,20 ],
				[480,70 ], [530,70 ], [580,70 ],
				[480,120], [530,120], [580,120],
				[480,170], [530,170], [580,170],
				[480,220], [530,220], [580,220],
				[480,270], [530,270], [580,270],
			];
			animate_wave_completed();
			waves.send_drops();
			if(game.current_wave == 1){
				wave_upgrade_timeout = setTimeout(
					store.animate_open
				,3000)
			}
		}
	},
	1: {
		init: function(){
			var r = rand_i(3,14);
			var p = waves.possible_positions;
			new Enemy_static(p[r-3][0],p[r-3][1],game.difficulty);
			new Enemy_static(p[r][0],p[r][1],game.difficulty)
			new Enemy_static(p[r+3][0],p[r+3][1],game.difficulty);
			wave_completion_check_interval = setInterval(waves.check_if_completed,250);
		},
		completed: false,
	},
	2: {
		init: function(){
			var r = rand_a([4,7,10,13]);
			var p = waves.possible_positions;
			new Enemy_static(p[r-1][0],p[r-1][1],game.difficulty);
			new Enemy_static(p[r+1][0],p[r+1][1],game.difficulty);
			new Enemy_static(p[r-3][0],p[r-3][1],game.difficulty);
			new Enemy_static(p[r+3][0],p[r+3][1],game.difficulty);
			wave_completion_check_interval = setInterval(waves.check_if_completed,250);
		},
		completed: false,
	},
	3: {
		init: function(){
			var r = rand_i(3,14);
			var p = waves.possible_positions;
			new Enemy_oscillating(p[r-3][0],p[r-3][1],game.difficulty);
			new Enemy_oscillating(p[r  ][0],p[r  ][1],game.difficulty)
			new Enemy_oscillating(p[r+3][0],p[r+3][1],game.difficulty);
			wave_completion_check_interval = setInterval(waves.check_if_completed,250);
		},
		completed: false,
	},
	4: {
		init: function(){
			var r = rand_i(6,11);
			var p = waves.possible_positions;
			new Enemy_static(p[r-6][0],p[r-6][1],game.difficulty);
			new Enemy_oscillating(p[r-3][0],p[r-3][1],game.difficulty);
			new Enemy_static(p[r][0],p[r][1],game.difficulty)
			new Enemy_oscillating(p[r+3][0],p[r+3][1],game.difficulty);
			new Enemy_static(p[r+6][0],p[r+6][1],game.difficulty);
			wave_completion_check_interval = setInterval(waves.check_if_completed,250);
		},
		completed: false,
	},
	5: {
		init: function(){
			var p = waves.possible_positions;
			new Enemy_static(p[6][0],p[6][1],game.difficulty);
			new Enemy_static(p[9][0],p[9][1],game.difficulty);
			new Enemy_static(p[4][0],p[4][1],game.difficulty);
			new Enemy_static(p[13][0],p[13][1],game.difficulty);

			new Enemy_oscillating(p[2][0],p[2][1],game.difficulty);
			new Enemy_oscillating(p[17][0],p[17][1],game.difficulty);
			wave_completion_check_interval = setInterval(waves.check_if_completed,250);
		},
		completed: false,
	},
	6: {
		init: function(){
			var p = waves.possible_positions;
			new Enemy_static(p[0][0],p[0][1],game.difficulty);
			new Enemy_static(p[2][0],p[2][1],game.difficulty);
			new Enemy_static(p[3][0],p[3][1],game.difficulty);
			new Enemy_static(p[5][0],p[5][1],game.difficulty);

			new Enemy_oscillating(p[7][0],p[7][1],game.difficulty);
			new Enemy_oscillating(p[10][0],p[10][1],game.difficulty);

			new Enemy_static(p[12][0],p[12][1],game.difficulty);
			new Enemy_static(p[14][0],p[14][1],game.difficulty);
			new Enemy_static(p[15][0],p[15][1],game.difficulty);
			new Enemy_static(p[17][0],p[17][1],game.difficulty);
			wave_completion_check_interval = setInterval(waves.check_if_completed,250);
		},
		completed: false,
	},
	7: {
		init: function(){
			new Enemy_boss(480, 85, 25)
		}
	}
}
