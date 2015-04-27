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
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    
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

    for(var i=0; i<buttons.length; i++){
    	var b = buttons[i];
    	if(x < b.x + b.w && x > b.x && y < b.y + b.h && y > b.y){
    		b.isPressed = true;
    	}
    }
    
}
function simulateTouchStart(x,y){
    for(var i=0; i<buttons.length; i++){
        var b = buttons[i];
        if(x < b.x + b.w && x > b.x && y < b.y + b.h && y > b.y){
            b.isPressed = true;
        }
    }
}
function simulateTouchEnd(x,y){
    for(var i=0; i<buttons.length; i++){
        var b = buttons[i];
        if(x < b.x + b.w && x > b.x && y < b.y + b.h && y > b.y){
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
        if(x < b.x + b.w && x > b.x && y < b.y + b.h && y > b.y){
            b.isPressed = false;
            b.onLift();
        }
    }
}

function loadMenu(){
    var a = new Menu(20,-280,440,280,[255,255,255,1]);
    a.dy = 6;
    a.animate = function(){
        if(a.y+a.h < 300){
            a.y += a.dy;
            a.dy ++
        }
        else{a.y = 300-a.h}
    }
	var b = new Button(0,0,480,320);
    b.onLift = function(){
        menus = [];
        buttons = [];
        texts = [];
        init();
    };
    menu_loop();
}
function splashScreen(){
    for(var a in sound.list){
        sound.load(eval("sound.list."+a));
    }
    ctx.font = "16px Georgia";
    ctx.fillStyle = "black";
    ctx.fillText("Created by Eli Anderson", 310, 320);
    //var x = 120
    //var inter = setInterval(function(){
    //    ctx.fillRect(x,140,10,20);
    //    x+=10;
    //    if(x >= 360){
    //        clearInterval(inter);
    //        setTimeout(loadMenu, 500)
    //    }
    //},100)
}
var TOTAL_ASSETS = 18;
var asset_counter = 0;
function handleAssetLoad(){

    ctx.fillRect(asset_counter*10 + 120,140,10,20);
    asset_counter++;
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
    requestAnimationFrame(menu_loop);
}

window.onload=splashScreen();

document.addEventListener('touchstart',handleTouchstart)
document.addEventListener('touchend',handleTouchend)
