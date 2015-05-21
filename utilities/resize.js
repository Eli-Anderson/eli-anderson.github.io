var game_screen = {
	mobile: false,
	width: 480,
	height: 320,
	padding_top: 0,
	padding_left: 0,
	dw: 1,
	dh: 1,
}
function detectDevice(){
	if(isMobile.any()){
		game_screen.mobile = true;
	}
    resizeCanvas();
    GAME.init()
}
function resizeCanvas(){

	var body = document.body;
    var html = document.documentElement;
	var width,height,padding_left,padding_top;
	if(!game_screen.mobile){
		
		
		height = Math.min( body.scrollHeight, body.offsetHeight,
		html.clientHeight, html.scrollHeight, html.offsetHeight ) - 3;
		width = Math.floor(height * (3/2));
		padding_left = Math.floor((window.innerWidth - width)/2);
		padding_top = 0;
		if(width > window.innerWidth){
			width = window.innerWidth - 3;
			height = Math.floor((2/3)*width);
			padding_left = 0;
			padding_top = Math.floor((window.innerHeight - height)/2);
		}
	}
	else{
		width = window.innerWidth;
		height = window.innerHeight;
	}
	canvas.style.width = width;
    canvas.style.height = height;
	canvas.style.left = padding_left || 0;
	canvas.style.top = padding_top || 0;
	game_screen.padding_left = padding_left || 0;
	game_screen.padding_top = padding_top || 0;
    game_screen.width = width;
    game_screen.height = height;
	game_screen.dw = (width/480);
	game_screen.dh = (height/320);
}
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};


