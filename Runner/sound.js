
var sound = {
	list: {
		heart_pickup: "SFX_Pickup_13.wav"
	},

	tracks: [document.getElementById('audio_main'),document.getElementById('audio_sub1'),document.getElementById('audio_sub2')],

	play: function(arg,track){
		sound.tracks[track].src = arg;
		sound.tracks[track].play();
	},
}