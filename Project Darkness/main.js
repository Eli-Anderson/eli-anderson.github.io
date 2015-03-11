var canvas = document.getElementById('canvas')
var main = canvas.getContext('2d')
var canvas2 = document.getElementById('canvas2')
var side = canvas2.getContext('2d')
var canvas3 = document.getElementById('object')
var objectlayer = canvas3.getContext('2d')
var selected = 'drag';
var tiles = new Image();
tiles.src = 'tiles.png'
var pointer = new Image();
pointer.src = 'http://upload.wikimedia.org/wikipedia/commons/b/b3/Mouse_pointer_or_cursor.png'
var light = new Image();
light.src = 'http://images.clipartpanda.com/light-bulb-png-BULB02.png'
var width = 32;
var map1 =  []
var objects1 = []
var source;
function init(){
	setTimeout(getFile,500)
	setInterval(getWidth,600)
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
    side.drawImage(light,0,418-32,32,32)
    if(selected == 'drag'){
    	side.drawImage(pointer,224,418,32,32)
    }
    else if(selected == '91'){
    	side.drawImage(light,224,418,32,32)
    }
    else{side.drawImage(tiles,selected*width,0,width,width,224,418,32,32)}
}

function getFile(){
	    drawSidebar()
	    overlayGrid()
	    getAttr()
}

function overlayGrid(){
    var m_width = document.getElementById('m_width').value;
    var m_height = document.getElementById('m_height').value
	if(map1[0] === undefined){
		for(var h=0; h<m_height; h++){
			map1.push([]);
			for(var t=0; t<m_width; t++){
				map1[h][t] = 0;
			}
		}
	}
	if(map1[m_height-1] === undefined){
	    for(var g=map1.length; g<m_height; g++){
	        map1.push([])
	        for(var f=0; f<m_width; f++){
	            map1[g][f] = 0;
	        }
	    }
	}
	var row_l = map1[0].length
	if(map1[m_height-1][m_width-1] === undefined){
	    for(var u=0; u<m_height; u++){
	        for(var r=row_l; r<m_width; r++){
	            map1[u][r] = 0;
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
	for(var j=0; j<map1.length; j++){
	    for(var k=0; k<map1[j].length; k++){
	        main.drawImage(tiles,map1[j][k]*width,0,width,width,k*width,j*width,width,width)
	    }
	}
	for(var e=0; e<objects1.length; e++){
	    main.drawImage(light,objects1[e][4]*width,objects1[e][5]*width,width,width)
	}
}


function downloadFile(){
    var text = ''
    var objs = ''
    for(var x=0; x<map1.length; x++){
        text += '['
        for(var y=0; y<map1[x].length; y++){
            text += map1[x][y]+',';
        }
        text += '],\n'
    }
    for(var i=0; i<objects1.length; i++){
        objs += '['
        for(var j=0; j<objects1[i].length; j++){
            objs += objects1[i][j]+',';
        }
        objs += '],\n'
    }
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('var map='+'['+text+']'+'\nvar objects='+'['+objs+']'));
    pom.setAttribute('download', 'map.js');
    pom.click();
}

function getMap(e){
    var file = e.target.files[0];
    var text = ''
    if(file){
        var reader = new FileReader();
        reader.onload = function(e){
            text = e.target.result;
            eval(text)
            map1 =  map;
            objects1 = objects;
            //objects1 = text.slice(text.lastIndexOf('='),text.length)
            //map1 =  eval(map)
            //objects1 = eval(objects1)
            document.getElementById('m_width').value = map1[0].length;
            document.getElementById('m_height').value = map1.length;
            getFile()
        }
        reader.readAsText(file);
    }
}
document.getElementById('map_in').addEventListener('change',getMap)
function getAttr(){
    var lr = document.getElementById('attr1').value;
    var lb = document.getElementById('attr2').value;
    var lf = document.getElementById('attr3').checked;
    document.getElementById('attr1_val').value = lr;
    document.getElementById('attr2_val').value = lb;
}



x5 = 0;
y5 = 0;
var start = false;
function handleClickMain(){
    var lr = document.getElementById('attr1_val').value;
    var lb = document.getElementById('attr2_val').value;
    var lf = document.getElementById('attr3').checked;
    
	var x = mouse.x
	var y = mouse.y
	var x2 = Math.abs(x % width);
	var y2 = Math.abs(y % width);
	var x3 = x-x2;
	var y3 = y-y2;
	if(mouse.down){
    	if(selected != 'drag'){
    		if(map1[(y3)/width] !== undefined){
    	 	   if(map1[(y3)/width][(x3)/width] !== undefined){
    	        	if(selected === 0){
    	        	    main.clearRect(x3-x5,y3-y5,width,width)
    	        	    map1[(y3)/width][(x3)/width] = selected;
    	        	}
    	        	else if(selected > 90){
    	        	    for(var i=0; i<objects1.length; i++){
    	        	        if(objects1[i][4]==x3/width && objects1[i][5]==y3/width){
    	        	            objects1.splice(i,1)
    	        	        }
    	        	    }
    	        	    objects1.push([selected,lr,lb,lf,x3/width,y3/width])
    	        	    objectlayer.drawImage(light,x3,y3,width,width)
    	        	}
    	        	else{
    	        	    map1[(y3)/width][(x3)/width] = selected;
    	        	    main.drawImage(tiles,selected*width,0,width,width,x3,y3,width,width);
    	        	}
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
	if(x > 0 && x < 32 && y > 418-32 && y < 418){
		selected = 91
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

document.getElementById('main').addEventListener('mousedown',function(){mouse.down = true;handleClickMain()})
document.getElementById('main').addEventListener('mousemove',handleMove)
document.getElementById('main').addEventListener('mouseup',handleClickUpMain)
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
