var canvas = document.getElementById('canvas')
var main = canvas.getContext('2d')
var canvas2 = document.getElementById('canvas2')
var side = canvas2.getContext('2d')
var canvas3 = document.getElementById('object')
var objectlayer = canvas3.getContext('2d')
var selected = 'drag';
var tiles = new Image();
tiles.src = 'tiles1.png'
var object_sheet = new Image();
object_sheet.src = 'light.png'
var pointer = new Image();
pointer.src = 'http://upload.wikimedia.org/wikipedia/commons/b/b3/Mouse_pointer_or_cursor.png'
var light = new Image();
light.src = 'http://images.clipartpanda.com/light-bulb-png-BULB02.png'
var width = 32;
var map1 =  []
var objects1 = []
var source;
function init(){
	setTimeout(reload,500)
	setInterval(getWidth,600)
}
function getWidth(){
    if(Number(document.getElementById('t_width').value) > 0){
	    width = Number(document.getElementById('t_width').value);
    }
    else{width = 32}
}
function loop(){
	map_width = Number(document.getElementById('m_width').value);
	map_height = Number(document.getElementById('m_height').value);
	width = Number(document.getElementById('t_width').value);
	setTimeout(loop,100)
}

function getImg(e){
    var file = e.target.files[0];
    if(file){
        var reader = new FileReader();
        reader.onload = function(e){
            var source = e.target.result;
            tiles.src = source
            reload()
        }
        reader.readAsDataURL(file);
    }
}
document.getElementById('t_upload').addEventListener('change',getImg)

function drawSidebar(){
	side.clearRect(0,0,256,450)
    if(Number(document.getElementById('t_width').value) > 0){
	    width = Number(document.getElementById('t_width').value);
        for(var y=0; y<tiles.height/width; y++){
            for(var x=0; x<tiles.width/width; x++){
                side.drawImage(tiles,x*width,y*width,width,width,x*width,y*width,width,width)
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
    else{
        side.drawImage(tiles,
            (selected%(tiles.width/width))*width,
            (selected-(selected%(tiles.width/width)))/(tiles.width/width)*width,
            width,width,
            224,418,32,32);
        //console.log(selected,(selected%(tiles.width/width)),(selected-(selected%(tiles.width/width)))/(tiles.width/width))
    }
}

function reload(){
        main.clearRect(-5000,-5000,10000,10000)
        objectlayer.clearRect(-5000,-5000,10000,10000)
        side.clearRect(0,0,256,450)
	    drawSidebar()
	    overlayGrid()
	    drawSelectionBorder()
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
    for(var j=0; j<map1.length; j++){
	    for(var k=0; k<map1[j].length; k++){
	        main.drawImage(tiles,(map1[j][k]%(tiles.width/width))*width,(map1[j][k]-(map1[j][k]%(tiles.width/width)))/(tiles.width/width)*width,width,width,k*width,j*width,width,width)
	    }
	}
	for(var e=0; e<objects1.length; e++){
	    objectlayer.drawImage(object_sheet,(objects1[e][0]-91)*width,0,width,width,objects1[e][4]*width,objects1[e][5]*width,width,width)
	}
	main.strokeStyle='gray'
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
    document.body.appendChild(pom);
    pom.click();
    document.body.removeChild(pom);
}

function getMap(e){
    var file = e.target.files[0];
    var text = ''
    console.log(file)
    if(file){
        var reader = new FileReader();
        reader.onload = function(e){
            text = e.target.result;
            eval(text)
            map1 =  map;
            objects1 = objects;
            document.getElementById('m_width').value = map1[0].length;
            document.getElementById('m_height').value = map1.length;
            reload()
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
var selection_counter = 0;
var selection = {
    x: 0,
    y: 0,
    x2: 0,
    y2: 0,
    closed: false,
    started: false,
}
function getSelection(){
    var x = mouse.x
	var y = mouse.y
	var x2 = Math.abs(x % Math.round(width*total_scale));
	var y2 = Math.abs(y % Math.round(width*total_scale));
	var x3 = x-x2;
	var y3 = y-y2;
	var w = Math.round(width*total_scale)
	x3 = Math.round(x3);
	y3 = Math.round(y3);
    if(map1[(y3)/w] !== undefined){
        if(map1[(y3)/w][(x3)/w] !== undefined){
            if(!selection_counter){
                selection.x = x3/w;
                selection.y = y3/w;
                selection.started = true;
            }
            else{
                if(x3/w < selection.x){var cx = 0}
                else{var cx = 1}
                if(y3/w < selection.y){var cy = 0}
                else{var cy = 1}
                selection.x2 = (x3/w)+cx;
                selection.y2 = (y3/w)+cy;
                selection.started = false;
                selection.closed = true;
                selection_counter = 0;
            }
            selection_counter++
        }
    }
    
}
function drawSelectionBorder(){
    objectlayer.lineWidth=total_scale;
    objectlayer.strokeStyle='red';
    if(selection.started){
        objectlayer.beginPath();
        objectlayer.moveTo((selection.x+.5)*(width*total_scale),(selection.y)*(width*total_scale));
        objectlayer.lineTo((selection.x-.5)*(width*total_scale),(selection.y)*(width*total_scale));
        objectlayer.moveTo((selection.x)*(width*total_scale),(selection.y+.5)*(width*total_scale));
        objectlayer.lineTo((selection.x)*(width*total_scale),(selection.y-.5)*(width*total_scale));
        objectlayer.stroke();
    }
    if(selection.closed){
        objectlayer.beginPath();
        objectlayer.moveTo(selection.x*(width*total_scale),selection.y*(width*total_scale));
        objectlayer.lineTo(selection.x2*(width*total_scale),selection.y*(width*total_scale));
        objectlayer.lineTo(selection.x2*(width*total_scale),selection.y2*(width*total_scale));
        objectlayer.lineTo(selection.x*(width*total_scale),selection.y2*(width*total_scale));
        objectlayer.closePath();
        objectlayer.stroke();
    }
}
function fillSelection(){
    //set map
    if(selection.closed){
        var w = Math.abs(selection.x2 - selection.x);
        var h = Math.abs(selection.y2 - selection.y);
        var x1 = selection.x;
        var y1 = selection.y;
        var x2 = selection.x2;
        var y2 = selection.y2;
        if(x1 > x2){
            var temp = x1;
            x1 = x2;
            x2 = temp;
        }
        if(y1 > y2){
            var temp2 = y1;
            y1 = y2;
            y2 = temp2;
        }
        for (var y=0; y<h; y++){
            for (var x=0; x<w; x++){
                map1[y+y1][x+x1] = selected;
            }
        }
        reload()
    }
}


document.addEventListener('keydown',handleKey)
function handleKey(e){
    if(e.keyCode==32){
        getSelection()
        reload();
    }
    if(e.keyCode==189 || e.keyCode==173){
        handleZoom('out')
    }
    else if(e.keyCode==187 || e.keyCode==61){
        handleZoom('in')
    }
    if(e.keyCode==86){
        log(total_scale+',')
    }
    if(e.keyCode==27){
	    selection.closed = false;
        selection.started = false;
        selection_counter = 0;
        reload();
    }
    if(e.keyCode==37){
        //left
        x5 += (width*total_scale);
        main.translate(width*total_scale,0);
        objectlayer.translate(width*total_scale,0);
        reload();
    }
    else if(e.keyCode==39){
        //right
        x5 -= (width*total_scale);
        main.translate(-width*total_scale,0);
        objectlayer.translate(-width*total_scale,0);
        reload();
    }
    if(e.keyCode==38){
        //up
        y5 += (width*total_scale);
        main.translate(0,width*total_scale);
        objectlayer.translate(0,width*total_scale);
        reload();
    }
    else if(e.keyCode==40){
        //down
        y5 -= (width*total_scale);
        main.translate(0,-width*total_scale);
        objectlayer.translate(0,-width*total_scale);
        reload();
    }
    //log(e.keyCode)
}

x5 = 0;
y5 = 0;
var start = false;
var start_coords = [0,0]
function handleClickMain(){
    var lr = document.getElementById('attr1_val').value;
    var lb = document.getElementById('attr2_val').value;
    var lf = document.getElementById('attr3').checked;
    
	var x = mouse.x
	var y = mouse.y
	var x2 = Math.abs(x % Math.round(width*total_scale));
	var y2 = Math.abs(y % Math.round(width*total_scale));
	var x3 = x-x2;
	var y3 = y-y2;
	var w = Math.round(width*total_scale)
	x3 = Math.round(x3);
	y3 = Math.round(y3);
	if(mouse.down){
    	if(selected != 'drag'){
    		if(map1[(y3)/w] !== undefined){
    	 	   if(map1[(y3)/w][(x3)/w] !== undefined){
                   getStartCoords(x3,y3)
    	        	if(selected === 0){
    	        	    main.clearRect(x3-x5,y3-y5,width,width)
    	        	    objectlayer.clearRect(x3-x5,y3-y5,width,width)
    	        	    map1[(y3)/w][(x3)/w] = selected;
    	        	}
    	        	else if(selected > 90){
    	        	    for(var i=0; i<objects1.length; i++){
    	        	        if(objects1[i][4]==x3/w && objects1[i][5]==y3/w){
    	        	            objects1.splice(i,1)
    	        	        }
    	        	    }
    	        	    objects1.push([selected,lr,lb,lf,x3/w,y3/w])
    	        	}
    	        	else{
    	        	    map1[(y3)/w][(x3)/w] = selected;
    	        	}
    	    	}
    		}
    	}
    	reload()
    }
}
function getStartCoords(x,y){
	if(mouse.down && start == false){
	    start_coords = [x,y];
	    start = true;
	}
}
function handleDrag(){
	if(mouse.down){
		var x = mouse.x
		var y = mouse.y
		var x2 = x % (width*total_scale);
		var y2 = y % (width*total_scale);
		var x3 = x-x2;
		var y3 = y-y2;
		var x4 = x3 - start_coords[0];
		var y4 = y3 - start_coords[1];
		if(selected == 'drag'){
		    x5 += x4;
		    y5 += y4;
		    if(Math.abs(x4) > (width*total_scale)/2 || Math.abs(y4) > (width*total_scale)/2){
		    	main.translate(x4,y4)
		    	objectlayer.translate(x4,y4)
		    	reload()
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
	for (var n=0; n<(tiles.height/width); n++){
	    for (var i=0; i<=tiles.width/width; i++){
		    if(x > i*width && x <(i+1)*width && y > n*width && y < (n+1)*width){
		    	    selected = i +(n*(tiles.width/width));
		    	    if(selection.closed){
		    	        fillSelection()
		    	        
		    	    }
		        
		    }
	    }
	}
	drawSidebar()
}
var total_scale = 1;
function handleZoom(dir){
    var scaler;
    if(dir == 'out'){
        scaler = (3/4)
        main.scale(scaler,scaler)
        total_scale = total_scale*scaler
    }
    else{
        scaler = (4/3);
        main.scale(scaler,scaler)
        total_scale = total_scale*scaler
    }
    reload()
}
document.getElementById('main').addEventListener('mousedown',function(){mouse.down = true;handleClickMain()})
document.getElementById('main').addEventListener('mousemove',handleMove)
document.getElementById('main').addEventListener('mouseup',handleClickUpMain)
canvas2.addEventListener('click',handleClickSide)


var mouse = {
	x: 0,
	y: 0,
	clientx: 0,
	clienty: 0,
	down: false,
}
var rect = canvas.getBoundingClientRect()
function handleMove(e){
    mouse.clientx = e.clientX - rect.left;
    mouse.clienty = e.clientY - rect.top;
	mouse.x = mouse.clientx - x5;
	mouse.y = mouse.clienty - y5;
	handleClickMain();
	handleDrag();
	reload();
	objectlayer.strokeStyle='black';
	objectlayer.lineWidth=1;
	objectlayer.beginPath();
	objectlayer.moveTo(mouse.x-5,mouse.y);
	objectlayer.lineTo(mouse.x+5,mouse.y);
	objectlayer.moveTo(mouse.x,mouse.y-5);
	objectlayer.lineTo(mouse.x,mouse.y+5);
    objectlayer.closePath();
	objectlayer.stroke()
	
}

function handleClickUpMain(){
	mouse.down = false;
	start = false;
}
window.onload = init();


//document.getElementById('body').setAttribute('class',"stop-scrolling")

function log(text){
    document.getElementById('log').innerHTML += text
}
