var buttons = [];
var menus = [];
var texts = [];
var images = [];

function animateMenus(){
	for(var i=0; i<menus.length; i++){
		menus[i].animate();
	}
}
function renderMenus(){
	for(var i=0; i<menus.length; i++){
		menus[i].render();
	}
}
function animateTexts(){
	for(var i=0; i<texts.length; i++){
		if(texts[i].animate === undefined){return}
		texts[i].animate();
	}
}
function renderTexts(){
	for(var i=0; i<texts.length; i++){
		texts[i].render();
	}
}
function animateImages(){
    for(var i=0; i<images.length; i++){
        images[i].animate();
    }
}
function renderImages(){
    for(var i=0; i<images.length; i++){
        images[i].render();
    }
}
function Img(src,fx,fy,fw,fh,x,y,w,h){
    images.push(this);
    this.src = src;
    this.fx = fx;
    this.fy = fy;
    this.fw = fw;
    this.fh = fh;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.dx = 0;
    this.dy = 0;
}
Img.prototype.animate = function(){
    this.y += this.dy;
    this.x += this.dx;
    this.dy *= .95;
    this.dx *= .95;
}
Img.prototype.render = function(){
    ctx.drawImage(this.src,this.fx,this.fy,this.fw,this.fh,this.x,this.y,this.w,this.h);
}
function Button(x,y,w,h){
	buttons.push(this)
    this.x = x*game_screen.dw;
    this.y = y*game_screen.dh;
    this.w = w*game_screen.dw;
    this.h = h*game_screen.dh;
    
	this.onTouch = function(){
	}
    this.onLift = function(){

    }
    this.isPressed = false;
}
function getButtonInput(){
    for(var i=0; i<buttons.length; i++){
        if(buttons[i].isPressed){
            buttons[i].onTouch();
        }
    }
}

function Menu(x,y,w,h,rgba){
	menus.push(this);
	this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.rgba = "rgba("+rgba[0]+","+rgba[1]+","+rgba[2]+","+rgba[3]+")";
}
Menu.prototype.render = function(){
	ctx.fillStyle = this.rgba;
	ctx.fillRect(this.x,this.y,this.w,this.h)
}

function Text(x,y,txt,font,rgba){
	texts.push(this);
	this.x = x;
	this.y = y;
    this.dx = 0;
    this.dy = 0;
	this.txt = txt;
	this.font = font;
	this.rgba = "rgba("+rgba[0]+","+rgba[1]+","+rgba[2]+","+rgba[3]+")";
}
Text.prototype.render = function(){
	ctx.fillStyle = this.rgba;
	ctx.font = this.font;
	ctx.fillText(this.txt,this.x,this.y);
}



function handleTouchstart(e){
	e.preventDefault();
    var x = e.changedTouches[0].clientX;
    var y = e.changedTouches[0].clientY;
	log(x,y)
    for(var i=0; i<buttons.length; i++){
    	var b = buttons[i];
    	if(x < b.x*game_screen.dw + b.w*game_screen.dw && x > b.x*game_screen.dw &&
		y < b.y*game_screen.dh + b.h*game_screen.dh && y > b.y*game_screen.dh){
    		b.isPressed = true;
    	}
    }
    
}
function simulateTouchStart(x,y){
    for(var i=0; i<buttons.length; i++){
        var b = buttons[i];
        if(x < b.x*game_screen.dw + b.w*game_screen.dw && x > b.x*game_screen.dw &&
           y < b.y*game_screen.dh + b.h*game_screen.dh && y > b.y*game_screen.dh){
            b.isPressed = true;
        }
    }
}
function simulateTouchEnd(x,y){
    for(var i=0; i<buttons.length; i++){
        var b = buttons[i];
        if(x < b.x*game_screen.dw + b.w*game_screen.dw && x > b.x*game_screen.dw &&
           y < b.y*game_screen.dh + b.h*game_screen.dh && y > b.y*game_screen.dh){
            b.isPressed = false;
            b.onLift();
        }
    }
}
function handleTouchend(e){
    var x = e.changedTouches[0].clientX;
    var y = e.changedTouches[0].clientY;
    for(var i=0; i<buttons.length; i++){
        var b = buttons[i];
        if(x < b.x*game_screen.dw + b.w*game_screen.dw && x > b.x*game_screen.dw &&
		y < b.y*game_screen.dh + b.h*game_screen.dh && y > b.y*game_screen.dh){
            b.isPressed = false;
            b.onLift();
        }
    }
}

function loadMenu(){
    
	var b = new Button(0,0,480,320);
    b.onLift = function(){
        menus = [];
        buttons = [];
        texts = [];
        menu_loop = null;
        init();
    };


    menu_loop();
}
function splashScreen(){
	ctx.fillStyle = "red";
	ctx.fillRect(120,140,250,20);
    for(var a in sound.list){
    	if(game_screen.mobile && a == "background_music"){continue}
        sound.load(sound.list[a]);
    }
	heart_img = new Image();
	heart_img.src = 'heart.png';
	heart_img.onload = handleAssetLoad(heart_img.src);
	player_img = new Image();
	player_img.src = "Ship/spritesheet.png";
	player_img.onload = handleAssetLoad(player_img.src);
	asteroid_img = new Image();
	asteroid_img.src = "a1.png";
	asteroid_img.onload = handleAssetLoad(asteroid_img.src);
	enemy_basic_img = new Image();
	enemy_basic_img.src = "Ship/stateczek.png";
	enemy_basic_img.onload = handleAssetLoad(enemy_basic_img.src);
	projectile_img = new Image();
	projectile_img.src = "beams.png";
	projectile_img.onload = handleAssetLoad(projectile_img.src);
	rocket_img = new Image();
	rocket_img.src = "icons.png"
	rocket_img.onload = handleAssetLoad(rocket_img.src);
	explosion_img = new Image();
	explosion_img.src = "explosion.png";
	explosion_img.onload = handleAssetLoad(explosion_img.src);
	
    ctx.font = "16px Georgia";
    ctx.fillStyle = "black";
    ctx.fillText("Created by Eli Anderson", 310, 300);
}
var TOTAL_ASSETS = 25;
var asset_counter = 0;
var asset_text = ""
function handleAssetLoad(arg){
	ctx.fillStyle = "green"
	asset_text = arg;
    ctx.fillRect(asset_counter*10 + 120,140,10,20);
    asset_counter++;
    ctx.font = "12px Georgia"
    ctx.fillStyle="black"
    ctx.fillText("loading... "+asset_text, 10,asset_counter*12)
    if(asset_counter >= TOTAL_ASSETS){
        loadMenu();
    }
    
}

function menu_loop(){
    ctx.clearRect(0,0,480,320);
    ctx.fillStyle='black'
    ctx.fillRect(0,0,480,320);
    animateMenus();
    animateTexts();
    renderMenus();
    renderTexts();
    ctx.fillStyle = 'white'
    ctx.font = "12px Georgia"
    ctx.fillText("Mobile: touch left game_screen to fly upward, and right game_screen to fire", 0, 100);
    ctx.fillText("Touch the top left corner to access the inventory, top right corner to access the store", 0, 120);
    ctx.font = "16px Georgia"
    ctx.fillText("PC: Use the UP ARROW to fly upward, and F to fire", 0, 160);
    ctx.fillText("Use S to access the inventory, and D to access the store", 0, 180);

    ctx.fillText("Touch, click, or hit UP to continue", 0, 300)
    requestAnimationFrame(menu_loop);
}
var game_screen = {
	mobile: false,
	width: 480,
	height: 320,
	dw: 1,
	dh: 1,
}
function detectDevice(){
	if(isMobile.any()){
		game_screen.mobile = true;
	}
	
	// only change the size of the canvas if the size it's being displayed
   // has changed.
   var width = window.innerWidth;
   var height = window.innerHeight;
   if (canvas.style.width != width ||
       canvas.style.height != height) {
     // Change the size of the canvas to match the size it's being displayed
	 
     canvas.style.width = width;
     canvas.style.height = height;
     game_screen.width = width;
     game_screen.height = height;
	 game_screen.dw = (width/480);
	 game_screen.dh = (height/320);
   }
   else{
        game_screen.width = width;
        game_screen.height = height;
		game_screen.dw = (width/480);
		game_screen.dh = (height/320);
   }
   if(width > 1080 || height > 720){
		width = 1080;
		height = 720;
		
		game_screen.dw = (width/canvas.style.width);
		game_screen.dh = (height/canvas.style.height);
		
		canvas.style.width = width;
		canvas.style.height = height;
		game_screen.width = width;
		game_screen.height = height;
		game_screen.dw = (width/480);
		game_screen.dh = (height/320);
   }
	
	splashScreen();
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
window.onload=detectDevice();

document.addEventListener('touchstart',handleTouchstart)
document.addEventListener('touchend',handleTouchend)
