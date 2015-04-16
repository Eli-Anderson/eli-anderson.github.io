var buttons = [];
var menus = [];
var texts = [];

function gui_loop (){
	//ctx.clearRect(0,0,480,320)
	//animateMenus();
	//animateTexts();
	//renderMenus();
	//renderTexts();
	//setTimeout(gui_loop,100/6)
}
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
    this.func = function(){};
    
	this.onTouch = function(){
		this.func()
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
    var x = e.changedTouches[0].clientX;
    var y = e.changedTouches[0].clientY;
    
    if(buttons.length === 0){
        game.awaitingInput = false;
    	input.up = true;
    }
    else{
    	for(var i=0; i<buttons.length; i++){
    		var b = buttons[i];
    		if(x < b.x + b.w && x > b.x && y < b.y + b.h && y > b.y){
    			b.onTouch();
    		}
    	}
    }
}
function simulateTouchStart(x,y){
    
    if(buttons.length === 0){
        game.awaitingInput = false;
    	input.up = true;
    }
    else{
    	for(var i=0; i<buttons.length; i++){
    		var b = buttons[i];
    		if(x < b.x + b.w && x > b.x && y < b.y + b.h && y > b.y){
    			b.onTouch();
    		}
    	}
    }
}
function simulateTouchEnd(x,y){
    input.up = false;
}
function handleTouchend(e){
    var x = e.changedTouches[0].clientX;
    var y = e.changedTouches[0].clientY;
    input.up = false;
}

function loadMenu(){
	b1 = new Button(0,0,480,320)
	b1.func = startGame;
	gui_loop();
}
function startGame(){
	init()
	del(b1);

}

window.onload=loadMenu();

document.addEventListener('touchstart',handleTouchstart)
document.addEventListener('touchend',handleTouchend)
