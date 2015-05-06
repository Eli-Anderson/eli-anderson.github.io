var enemies = [];

var enemy_vars = {
	
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
	if(game.frame == 300){
		waves[1].init();
	}
}

function Enemy(x,y){
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

function Enemy_medium(x,y){
	Enemy.call(this,x,y);
	this.img = enemy_basic_img;
	this.w = 20;
	this.h = 20;

	this.maxVel = 3;
	this.framesPerShot = 90;
	this.hp = 3;
	var that = this;
	this.drops = [
		function(){new HealthUpgrade(that.x,that.y,rand_i(1,3))},
		function(){new RocketLauncherUpgrade(that.x,that.y,3)},
		function(){new Orb(that.x,that.y,rand_i(5,10))},
	];

	this.ddy = 0;

	this.sound = sound.list.enemy_medium_hit;
	
	this.animate = function(){
		if(game.frame % 20 == 0){
			if(this.hp < 3){
				effects.ship.smoke_trail(this.x,this.y,0.3*this.hp)
			}
		}
		if(this.y < player.y){this.ddy = rand_i(0,2)}
		else{this.ddy = rand_i(-2,0);}
		if(Math.abs(this.dy) < this.maxVel){
			this.dy += this.ddy;
		}
		this.dy *= game.global_dxdy;
		this.dx *= game.global_dxdy;
		
		this.y += this.dy;
		this.dy *= 0.99;
		this.ddy *= 0.5;
		
		if((game.frame - this.frame) % this.framesPerShot === 0 && !game.awaitingInput){this.fire()}
	};
	this.fire = function(){
		var dx = player.x - this.x;
		var dy = player.y - this.y;
		var dist = Math.sqrt(dx*dx+dy*dy);
		dx/=dist;
		dy/=dist;
		new Projectile_basic(this.x,this.y,-1,0,player);
	};
}
Enemy_medium.prototype = Object.create(Enemy.prototype);
Enemy_medium.prototype.constructor = Enemy_medium;

function Enemy_easy(x,y){
	Enemy.call(this,x,y);
	this.img = enemy_basic_img;
	this.w = 25;
	this.h = 25;

	this.maxVel = 3;
	this.framesPerShot = 90;
	this.hp = 1;
	var that = this;
	this.drops = [
		function(){new HealthUpgrade(that.x,that.y,1)},
		function(){new RocketLauncherUpgrade(that.x,that.y,1)},
		function(){new Orb(that.x,that.y,rand_i(1,3))},
	]
	this.counter = 0;
	this.dy = 0;
	this.dx = 0;
	this.friction = 0.99;
	this.sound = sound.list.enemy_easy_hit;
	
	this.animate = function(){
		this.dy = 4*Math.cos(this.counter);
		
		this.dy *= game.global_dxdy;
		this.dx *= game.global_dxdy;
		
		this.y += this.dy;
		
		if((game.frame - this.frame) % this.framesPerShot === 0 && !game.awaitingInput){this.fire()}
		this.counter += Math.PI/128;
	};
	this.fire = function(){
		new Projectile_basic(this.x,this.y,-1,0,player);
	};
}

Enemy_easy.prototype = Object.create(Enemy.prototype);
Enemy_easy.prototype.constructor = Enemy_easy;

function Enemy_static(x,y,hp){
	Enemy.call(this,x,y);
	this.img = enemy_basic_img;
	this.w = 25;
	this.h = 25;

	this.framesPerShot = 90;
	this.hp = hp;
	var that = this;
	this.drops = [
		function(){new HealthUpgrade(that.x,that.y,1)},
		function(){new RocketLauncherUpgrade(that.x,that.y,1)},
		function(){new Orb(that.x,that.y,rand_i(1,3))},
	]
	this.sound = sound.list.enemy_easy_hit;
	
	this.animate = function(){
		if((game.frame - this.frame) % this.framesPerShot === 0 && !game.awaitingInput){this.fire()}
	};
	this.fire = function(){
		new Projectile_basic(this.x,this.y,-1,0,player);
	};
}

Enemy_static.prototype = Object.create(Enemy.prototype);
Enemy_static.prototype.constructor = Enemy_static;

function Enemy_oscillating(x,y,hp){
	Enemy.call(this,x,y);
	this.img = enemy_basic_img;
	this.w = 25;
	this.h = 25;

	this.framesPerShot = 90;
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
		if((game.frame - this.frame) % this.framesPerShot === 0 && !game.awaitingInput){this.fire()};
		this.dy = 1.5*Math.cos(this.counter);
		this.y += this.dy;
		if(game.frame % 10 == 0){
			this.counter += Math.PI/16;
		}
	};
	this.fire = function(){
		new Projectile_basic(this.x,this.y,-1,0,player);
	};
}

Enemy_oscillating.prototype = Object.create(Enemy.prototype);
Enemy_oscillating.prototype.constructor = Enemy_oscillating;


var send_next_wave_timeout,wave_completion_check_interval,wave_upgrade_timeout;
var waves = {
	number_of_waves: 6,
	possible_positions: [
		[350,20 ], [400,20 ], [450,20 ],
		[350,70 ], [400,70 ], [450,70 ],
		[350,120], [400,120], [450,120],
		[350,170], [400,170], [450,170],
		[350,220], [400,220], [450,220],
		[350,270], [400,270], [450,270],
	],
	next_wave_frame: 0,
	send_next_wave: function(){
		if(waves[game.current_wave] === undefined){
			game.current_wave = 1;
			game.difficulty ++;
			background.dx = Math.sqrt(game.difficulty);
		}
		var interval = setInterval(function(){
			if(game.running_frame - waves.next_wave_frame >= 360){
				waves[game.current_wave].init();
				clearInterval(interval);
			}
		},5);
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
		var y = rand_i(0,300);
		var amt;
		if(Math.random() <= player.luck){
			amt = rand_i(game.difficulty,3*game.difficulty);
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
			game.current_wave ++;
			waves.next_wave_frame = game.running_frame;
			waves.send_next_wave();
			waves.possible_positions = [
				[350,20 ], [400,20 ], [450,20 ],
				[350,70 ], [400,70 ], [450,70 ],
				[350,120], [400,120], [450,120],
				[350,170], [400,170], [450,170],
				[350,220], [400,220], [450,220],
				[350,270], [400,270], [450,270],
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
}
