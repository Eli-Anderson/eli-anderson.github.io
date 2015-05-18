function init(){
	floor = new Game_Object(0,450,720,30)
	gameObjects.push(floor)
	player = new Player(50,250,1);
	scene.add(player);
	scene.add(floor)
	game.loop();
}


var game = {
	loop: function(){
		ctx.clearRect(0,0,720,480);
		player.animate()
		scene.render()
		requestAnimationFrame(game.loop)
	}
}


window.onload = init();