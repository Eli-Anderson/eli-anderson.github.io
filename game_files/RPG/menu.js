
window.onload=init()

function init(){
	mainMenu()
	menuLoop()
}

function mainMenu(){
	create_menu(0,0,480,480,119, 101, 60,1)
	create_menu(0,0,480,480,119, 101, 60,.8)
	create_image(loadbutton,50,90)
	create_menu(50,90,380,80,0,0,0,0,function(){loadGame();menu_list=[];text_list=[];image_list=[];})
}

function menuLoop(){
	if(!game.playing){
		ctx.clearRect(0,0,480,480)
		draw_menu();
		draw_text();
		draw_image();
		requestAnimationFrame(menuLoop)
	}
}