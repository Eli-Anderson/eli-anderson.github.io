var canvas = document.getElementById('canvas')
var main = canvas.getContext('2d')
var canvas2 = document.getElementById('canvas2')
var side = canvas2.getContext('2d')
var selected = 0;
var tiles = new Image();
tiles.src = 'tiles.png'
var width = 32;
var map = []
var source;
function init(){
	getFile()
	setInterval(function(){getWidth()},100)
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
    if(Number(document.getElementById('t_width').value) > 0){
	    width = Number(document.getElementById('t_width').value);
	    for(var n=0; n<Math.ceil((tiles.width/width)/8); n++){
	        for(var i=1; i<=tiles.width/width; i++){
                side.drawImage(tiles,i*width,0,width,width,(i-(8*n))*width,n*width,width,width)
	        }
	    }
    }
    else if(width > 0){
        for(var i=0; i<tiles.width/width; i++){
	    	side.drawImage(tiles,i*width,0,width,width,i*width,0,width,width)
	    }
    }
    else{width = 32; drawSidebar()}
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
	            //alert(f)
	            map[g][f] = 0;
	        }
	    }
	}
	var row_l = map[0].length
	if(map[m_height-1][m_width-1] === undefined){
	    for(var u=0; u<m_height; u++){
	        for(var r=row_l; r<m_width; r++){
	            //alert(f)
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
        text += '], \n'
    }
    document.getElementById('p_map').value = text
}

x5 = 0;
y5 = 0;
function handleClickMain(e){
	var x = e.clientX - 10;
	var y = e.clientY - 10;
	var x2 = x % width;
	var y2 = y % width;
	var x3 = x-x2;
	var y3 = y-y2;
	if(map[(y3-y5)/width] !== undefined){
	    if(map[(y3-y5)/width][(x3-x5)/width] !== undefined){
	        main.drawImage(tiles,selected*width,0,width,width,x3-x5,y3-y5,width,width);
	        if(selected === 0){
	            main.clearRect(x3-x5,y3-y5,width,width)
	        }
	        map[(y3-y5)/width][(x3-x5)/width] = selected;
	    }
	}
	start_coords = [x3,y3];
}
function handleDrag(e){
    log('drag')
	var x = e.clientX - 10;
	var y = e.clientY - 10;
	var x2 = x % width;
	var y2 = y % width;
	var x3 = x-x2;
	var y3 = y-y2;
	var x4 = x3 - start_coords[0];
	var y4 = y3 - start_coords[1];
	log((y3))
	if(selected == 'drag'){
	    x5 += x4;
	    y5 += y4;
	    if(Math.abs(x4) > width/2 || Math.abs(y4) > width/2){
	    	main.translate(x4,y4)
	    	main.clearRect(-5000,-5000,10000,10000)
	    	overlayGrid()
	    }
	}
	
	else{
	    log((y3-y5)/width)
	    if(map[(y3-y5)/width] !== undefined){
	    if(map[(y3-y5)/width][(x3-x5)/width] !== undefined){
	        main.drawImage(tiles,selected*width,0,width,width,x3-x5,y3-y5,width,width);
	        if(selected === 0){
	            main.clearRect(x3-x5,y3-y5,width,width)
	        }
	        map[(y3-y5)/width][(x3-x5)/width] = selected;
	    }
	    }
	}
}
function handleClickSide(e){
	var x = e.pageX - 915;
	var y = e.pageY - 10;
	for (var n=0; n<Math.ceil((tiles.width/width)/8); n++){
	    for (var i=0; i<=tiles.width/width; i++){
		    if(x > i*width && x <(i+1)*width && y > n*width && y < width+(n*width)){
		        if(i+ (n*8) < tiles.width/width){
		    	    selected = i +(n*8);
		        }
		    }
	    }
	}
}

canvas.addEventListener('mousedown',handle)
//canvas.addEventListener('mouseup',handleDrag)
canvas2.addEventListener('click',handleClickSide)

function handle(e){
    var evt = e;
    handleClickMain(evt);
    setInterval(function(evt){
        var e = evt;
        handleDrag(e)},100)
}

window.onload = init();

function log(text){
    document.getElementById('log').innerHTML += text
}
