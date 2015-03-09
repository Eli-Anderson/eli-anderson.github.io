var canvas = document.getElementById('canvas')
var main = canvas.getContext('2d')
var canvas2 = document.getElementById('canvas2')
var side = canvas2.getContext('2d')
var selected = 0;
var tiles = new Image();
tiles.src = 'tiles.png'
var pointer = new Image();
pointer.src = 'http://upload.wikimedia.org/wikipedia/commons/b/b3/Mouse_pointer_or_cursor.png'
var width = 32;
var map = []
var source;
function init(){
	setTimeout(getFile,200)
	setInterval(function(){getWidth},300)
}
function getWidth(){
    if(Number(document.getElementById('t_width').value) > 0){
	    width = Number(document.getElementById('t_width').value);
    }
    else{width = 32}
    //drawSidebar();
}
function loop(){
	map_width = Number(document.getElementById('m_width').value);
	map_height = Number(document.getElementById('m_height').value);
	width = Number(document.getElementById('t_width').value);
	setTimeout(loop,100)
}


function drawSidebar(){
	side.clearRect(0,0,256,450)
    if(Number(document.getElementById('t_width').value) > 0){
	    width = Number(document.getElementById('t_width').value);
	    for(var n=0; n<Math.ceil((tiles.width/width)/8); n++){
	        for(var i=1; i<=tiles.width/width; i++){
                side.drawImage(tiles,i*width,0,width,width,(i-(8*n))*width,n*width,width,width)
	        }
	    }
    }
    else if(width > 0){
        for(var k=0; k<tiles.width/width; k++){
	    	side.drawImage(tiles,k*width,0,width,width,k*width,0,width,width)
	    }
    }
    else{width = 32; drawSidebar()}
    side.drawImage(pointer,0,418,32,32)
    if(selected == 'drag'){
    	side.drawImage(pointer,224,418,32,32)
    }
    else{side.drawImage(tiles,selected*width,0,width,width,224,418,32,32)}
}

function getFile(){
	    drawSidebar()
	    overlayGrid()
}

function overlayGrid(){
    var m_width = document.getElementById('m_width').value;
    var m_height = document.getElementById('m_height').value
	if(map[0] === undefined){
		for(var h=0; h<m_height; h++){
			map.push([]);
			for(var t=0; t<m_width; t++){
				map[h][t] = 0;
			}
		}
	}
	if(map[m_height-1] === undefined){
	    for(var g=map.length; g<m_height; g++){
	        map.push([])
	        for(var f=0; f<m_width; f++){
	            map[g][f] = 0;
	        }
	    }
	}
	var row_l = map[0].length
	if(map[m_height-1][m_width-1] === undefined){
	    for(var u=0; u<m_height; u++){
	        for(var r=row_l; r<m_width; r++){
	            map[u][r] = 0;
	        }
	    }
	}

	main.fillStyle='gray'
	//vertical
	for(var i=0; i<=m_width; i++){
		main.beginPath();
		main.moveTo(i*width,0);
		main.lineTo(i*width,m_height*width);
		main.closePath();
		main.stroke();
	}
	//horizontal
	for(var n=0; n<=m_height; n++){
		main.beginPath();
		main.moveTo(0,n*width);
		main.lineTo(m_width*width,n*width);
		main.closePath();
		main.stroke();
	}
	for(var j=0; j<map.length; j++){
	    for(var k=0; k<map[j].length; k++){
	        main.drawImage(tiles,map[j][k]*width,0,width,width,k*width,j*width,width,width)
	    }
	}
}

function getMap(){
    var text = ''
    for(var x=0; x<map.length; x++){
        text += '['
        for(var y=0; y<map[x].length; y++){
            text += map[x][y]+',';
        }
        text += '],\n'
    }
    document.getElementById('p_map').value = text
}

x5 = 0;
y5 = 0;
var start = false;
function handleClickMain(){
    
	var x = mouse.x
	var y = mouse.y
	var x2 = Math.abs(x % width);
	var y2 = Math.abs(y % width);
	var x3 = x-x2;
	var y3 = y-y2;
	if(mouse.down){
    	if(selected != 'drag'){
    		if(map[(y3)/width] !== undefined){
    	 	   if(map[(y3)/width][(x3)/width] !== undefined){
    	 	   		//log('2,')
    	 	   		main.drawImage(tiles,selected*width,0,width,width,x3,y3,width,width);
    	        	if(selected === 0){
    	        	    main.clearRect(x3-x5,y3-y5,width,width)
    	        	}
    	        	map[(y3)/width][(x3)/width] = selected;
    	    	}
    		}
    	}
    }
	if(mouse.down && start === false){start_coords = [x3,y3];start = true;}
}
function handleDrag(){
	if(mouse.down){
		var x = mouse.x
		var y = mouse.y
		var x2 = x % width;
		var y2 = y % width;
		var x3 = x-x2;
		var y3 = y-y2;
		var x4 = x3 - start_coords[0];
		var y4 = y3 - start_coords[1];

		if(selected == 'drag'){
		    x5 += x4;
		    y5 += y4;
		    if(Math.abs(x4) > width/2 || Math.abs(y4) > width/2){
		    	main.translate(x4,y4)
		    	main.clearRect(-5000,-5000,10000,10000)
		    	overlayGrid()
		    }
		}
	}
}
function handleClickSide(e){
	var x = e.pageX - 915;
	var y = e.pageY - 10;
	if(x > 0 && x < 32 && y > 418 && y < 450){
		selected = 'drag'
	}
	for (var n=0; n<Math.ceil((tiles.width/width)/8); n++){
	    for (var i=0; i<=tiles.width/width; i++){
		    if(x > i*width && x <(i+1)*width && y > n*width && y < width+(n*width)){
		        if(i+ (n*8) < tiles.width/width){
		    	    selected = i +(n*8);
		        }
		    }
	    }
	}
	drawSidebar()
}

canvas.addEventListener('mousedown',function(){mouse.down = true;handleClickMain()})
canvas.addEventListener('mousemove',handleMove)
canvas.addEventListener('mouseup',handleClickUpMain)
canvas2.addEventListener('click',handleClickSide)


var mouse = {
	x: 0,
	y: 0,
	down: false,
}
function handleMove(e){
	mouse.x = e.clientX - 10 - x5;
	mouse.y = e.clientY - 10 - y5;
	handleClickMain()
	handleDrag()
}

function handleClickUpMain(){
	mouse.down = false;
	start = false;
}

window.onload = init();

function log(text){
    document.getElementById('log').innerHTML += text
}
