var buttons = [];
var menus = [];
var texts = [];

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
function Button(x,y,w,h){
	buttons.push(this)
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    
	this.onTouch = function(){
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
	ctx.fillText(this.txt,this.x,this.y)
}



function handleTouchstart(e){
	e.preventDefault();
    for(var n=0; n<e.touches.length; n++){
        var x = e.touches[n].clientX;
        var y = e.touches[n].clientY;
    
    	for(var i=0; i<buttons.length; i++){
    		var b = buttons[i];
    		if(x < b.x + b.w && x > b.x && y < b.y + b.h && y > b.y){
    			b.onTouch();
                break;
    		}
    	}
    }
    
}
function simulateTouchStart(x,y){
    for(var i=0; i<buttons.length; i++){
    	var b = buttons[i];
    	if(x < b.x + b.w && x > b.x && y < b.y + b.h && y > b.y){
    		b.onTouch();
    	}
    }
}
function simulateTouchEnd(x,y){
    if(x < 240 && x > 0 && y > 0 && y < 320 && game.running){
        input.up = false;
    }
}
function handleTouchend(e){
    var x = e.changedTouches[0].clientX;
    var y = e.changedTouches[0].clientY;
    if(x < 240 && x > 0 && y > 0 && y < 320 && game.running){
        input.up = false;
    }
}

function loadMenu(){
	init()
}

window.onload=loadMenu();

document.addEventListener('touchstart',handleTouchstart)
document.addEventListener('touchend',handleTouchend)
