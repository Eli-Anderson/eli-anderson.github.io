
var sound = {
	list: {
		heart_pickup: "SFX_Pickup_13.wav",
		rocket_pickup: "SFX_Pickup_01.wav",
		rocket_fire: "fire3.wav",
		rocket_explosion: "explosion.ogg",
		default_fire: "fire1.wav",
		coin_pickup: "sfx7.wav",
	},

	tracks: [document.getElementById('audio_main'),document.getElementById('audio_sub1'),document.getElementById('audio_sub2')],

	play: function(arg,track){
		var a = sound.tracks[track];
		a.src = arg
		a.play();
	},
}