var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

function init(){
	map = gen_map(360,240);
	gen_noise(rand_int(1111,9999), map)
	
	draw_map(map);
}

function gen_map(w,h){
	var map = [];
	for(var y=0; y < h; y++){
		map.push([]);
		for(var x=0; x < w; x++){
			map[y][x] = 0;
		}
	}
	return map;
}

function gen_noise(int_seed, map){
	var result = [];
	var n = new BigNumber(int_seed);
	while(result.length < map.length*map[0].length){
		n = n.multiply(n);
		n_s = n.toString();
		for(var i=0; i<n_s.length; i++){
			result.push(Number(n_s[i]));
		}
	}
	var c=0;
	for(var y=0; y<map.length; y++){
		for(var x=0; x<map[y].length; x++){
			map[y][x] = result[c]
			c++;
		}
	}
}


function draw_map(map){
	var w = canvas.width/map[0].length;
	var h = canvas.height/map.length;
	var color,value;
	for(var y=0; y<map.length; y++){
		for(var x=0; x<map[y].length; x++){
			value = map[y][x];
			switch(value){
				case 0:
				case 1:
				case 2:
					value = 1;
					break;
				case 3:
				case 4:
				case 5:
					value = 4;
					break;
				case 6:
				case 7:
				case 8:
				case 9:
					value = 7;
					break;
			}
			color = value * 28;
			ctx.fillStyle = "rgb("+color+","+color+","+color+")";
			ctx.fillRect(x*w,y*h,w,h);
		}
	}
	//ctx.stroke()
}

function rand_int(n1,n2){
	return n1+ Math.round(Math.random()*(n2-n1));
}

window.onload = init();