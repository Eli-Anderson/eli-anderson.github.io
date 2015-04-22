
var sound = {
	list: {
		heart_pickup: "SFX_Pickup_13.wav",
		rocket_pickup: "SFX_Pickup_01.wav",
		rocket_fire: "fire3.wav",
		rocket_explosion: "explosion.ogg",
		default_fire: "fire1.wav",
		coin_pickup: "sfx7.wav",
		plasma_fire: "fire2.wav"
	},

	play: function(arg){
		var a = new Howl({
			urls: [arg]
		});
		a.play();
	},
}