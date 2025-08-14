var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

function init(){
	map0_0 = gen_map(72,48);
	map0_1 = gen_map(72,48);
	map0_2 = gen_map(72,48);
	
	map1_0 = gen_map(72,48);
	map1_1 = gen_map(72,48);
	map1_2 = gen_map(72,48);
	
	map2_0 = gen_map(72,48);
	map2_1 = gen_map(72,48);
	map2_2 = gen_map(72,48);
	num_of_maps = 9;
	
	var r = rand_int(1111,9999);
	gen_noise(r, map0_0);
	gen_noise(r, map0_1);
	gen_noise(r, map0_2);
	gen_noise(r, map1_0);
	gen_noise(r, map1_1);
	gen_noise(r, map1_2);
	gen_noise(r, map2_0);
	gen_noise(r, map2_1);
	gen_noise(r, map2_2);
	//gen_noise(rand_int(1111,9999), map0_0)
	draw_map(map0_0,0,0);
	draw_map(map0_1,0,1);
	draw_map(map0_2,0,2);
	draw_map(map1_0,1,0);
	draw_map(map1_1,1,1);
	draw_map(map1_2,1,2);
	draw_map(map2_0,2,0);
	draw_map(map2_1,2,1);
	draw_map(map2_2,2,2);
}

function gen_map(w, h){
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
	while(result.length < map.length*map[0].length+1){
		n = n.multiply(n);
		n_s = n.toString();
		for(var i=0; i<n_s.length; i++){
			result.push(Number(n_s[i]));
		}
	}
	var c=map[0].length + 1;
	for(var y=0; y<map.length; y++){
		for(var x=0; x<map[y].length; x++){
			//map[y][x] = result[c]
			map[y][x] = Math.round((result[c-1] + result[c-map[0].length] + result[c])/3);
			c++;
		}
	}
}


function draw_map(map, pos_x, pos_y){
	var w = (canvas.width/map[0].length)/Math.sqrt(num_of_maps);
	var h = (canvas.height/map.length)/Math.sqrt(num_of_maps);
	var offset = {
		x: pos_x * map[0].length,
		y: pos_y * map.length,
	}
	var color,value;
	for(var y=0; y<map.length; y++){
		for(var x=0; x<map[y].length; x++){
			value = map[y][x];
			
			switch(value){
				case 0:
				case 1:
				case 2:
					//value = 1;
					break;
				case 3:
				case 4:
				case 5:
					//value = 4;
					break;
				case 6:
				case 7:
				case 8:
				case 9:
					//value = 7;
					break;
			}
			
			color = value * 28;
			ctx.fillStyle = "rgb("+color+","+color+","+color+")";
			ctx.fillRect((x+offset.x)*w,(y+offset.y)*h,w,h);
		}
	}
	//ctx.stroke()
}

function rand_int(n1,n2){
	return n1+ Math.round(Math.random()*(n2-n1));
}

window.onload = init();
