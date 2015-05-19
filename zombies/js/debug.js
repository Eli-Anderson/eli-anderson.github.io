function init(){
	floor = new Game_Object(0,450,720,30)
	gameObjects.push(floor)
	wall = new Game_Object(450,420,30,30)
	gameObjects.push(wall)
	player = new Player(50,250,1);
	scene.add(player);
	scene.add(floor)
	scene.add(wall)
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