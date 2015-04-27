
var sound = {
	list: {
		heart_pickup: [["SFX_Pickup_13.wav"]],
		rocket_pickup: [["SFX_Pickup_01.wav"]],
		rocket_fire: [["fire3.wav"]],
		rocket_explosion: [["explosion.ogg"]],
		default_fire: [["fire1.wav"]],
		orb_pickup: [["SFX_Pickup_06.wav"],.25],
		plasma_fire: [["fire2.wav"]],
		player_hit: [["sfx4.wav"]],
		player_killed: [["sfx5.wav"]],
		enemy_easy_hit: [["sfx9.wav"]],
		enemy_easy_killed: [["sfx14.wav"]],
		enemy_medium_hit: [["sfx9.wav"]],
		enemy_medium_killed: [["sfx14.wav"]],
		countdown: [["sfx17.wav"]],
		err: [["sfx9.wav"]],
		purchase: [["sfx7.wav"]],
		out_of_ammo: [["sfx11.wav"]],
		background_music: [["Clearside - Assimilator.wav"],.5,true],

	},

	play: function(arg){
		var a = new Howl({
			urls: arg[0],
			volume: arg[1] || 1,
			loop: arg[2] || false,
		});
		a.play();
	},
	load: function(arg){
		var a = new Howl({
			urls: arg[0],
			volume: 0,
			onload: function(){
				handleAssetLoad();
			},
			onerror: function(){
				console.error("Sound asset failed to load");
				ctx.fillText("Sound asset failed to load",0,30)
			}
		});

	}
}