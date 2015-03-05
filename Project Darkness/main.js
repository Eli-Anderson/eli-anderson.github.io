var canvas = document.getElementById('canvas')
var main = canvas.getContext('2d')
var canvas2 = document.getElementById('canvas2')
var side = canvas2.getContext('2d')
var selected = 0;
var tiles = new Image();

var map = []
function init(){
	getFile()
}

function loop(){
	//main.clearRect(0,0,900,450)
	//side.drawImage(tiles,0,0)
}


function drawSidebar(){
	width = Number(document.getElementById('t_width').value);
	for(var i=0; i<tiles.width/width; i++){
		side.drawImage(tiles,i*width,0,width,width,i*width,0,width,width)
	}
}

function getFile(){
	var source = document.getElementById('file').value;
	tiles.src = source;
	drawSidebar()
	overlayGrid()
}

function overlayGrid(){
	if(map[0] === undefined){
		for(var j=0; j<Math.round(900/width); j++){
			map.push([])
			for(var t=0; t<Math.round(450/width); t++){
				map[j][t] = 0;
			}
		}
	}

	main.fillStyle='gray'
	for(var i=0; i<900/width; i++){
		main.beginPath();
		main.moveTo(i*width,0);
		main.lineTo(i*width,450);
		main.closePath();
		main.stroke();
	}
	for(var n=0; n<900/width; n++){
		main.beginPath();
		main.moveTo(0,n*width);
		main.lineTo(900,n*width);
		main.closePath();
		main.stroke();
	}
}

function handleClickMain(e){
	var x = e.clientX - 10;
	var y = e.clientY - 10;
	var x2 = x % width;
	var y2 = y % width;
	var x3 = x-x2
	var y3 = y-y2
	main.drawImage(tiles,selected*width,0,width,width,x3,y3,width,width)
	map[y3/width][x3/width] = selected;
	start_coords = [x3,y3]
}
function handleDrag(e){
	var x = e.clientX - 10;
	var y = e.clientY - 10;
	var x2 = x % width;
	var y2 = y % width;
	var x3 = x-x2;
	var y3 = y-y2;
	var x4 = x3 - start_coords[0];
	var y4 = y3 - start_coords[1];
	if(Math.abs(x4) > width/2 || Math.abs(y4) > width/2){
		main.translate(x4,y4)
		main.clearRect(-5000,-5000,10000,10000)
		overlayGrid()
	}
}
function handleClickSide(e){
	var x = e.pageX - 915;
	var y = e.pageY - 10;
	for (var i=0; i<4; i++){
		if(x > i*width && x <(i+1)*width && y > 0 && y < width){
			selected = i;
		}
	}
}

canvas.addEventListener('mousedown',handleClickMain)
canvas.addEventListener('mouseup',handleDrag)
canvas2.addEventListener('click',handleClickSide)

window.onload = init();