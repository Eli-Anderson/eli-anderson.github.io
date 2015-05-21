//rectangle and array of circles
function isColliding_r_cArr(r,c_arr){
	for(var i=0; i<c_arr.length; i++){
		var c = c_arr[i];

		var distX = Math.abs(c.x - r.x-r.w/2);
	    var distY = Math.abs(c.y - r.y-r.h/2);

		if (distX > (r.w/2 + c.r)) { continue; }
    	if (distY > (r.h/2 + c.r)) { continue; }

		if (distX <= (r.w/2)) { return true; } 
		if (distY <= (r.h/2)) { return true; }

		var dx=distX-r.w/2;
		var dy=distY-r.h/2;
		if(dx*dx+dy*dy<=(c.r*c.r)){ return true; }
	}
	return false;
}

function toRgba(arr){
	return "rgba("+arr[0]+","+arr[1]+","+arr[2]+","+arr[3]+")";
}

//return random integer between two numbers
function rand_int(n1,n2){
	return n1+Math.floor(Math.random()*(n2-n1));
}
//return random double between two numbers
function rand_doub(n1,n2){
	return n1+Math.random()*(n2-n1);
}
//return random element of array
function rand_arr(arr){
	var r = rand_i(0,arr.length);
	return arr[r];
}
//return random string of length n, from set array or entire alphabet
function rand_str(n, str){
	var str = str || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var result = "";
	for(var i=0; i<n; i++){
		result += str.charAt(rand_int(0,str.length));
	}
	return result;
}


//delete object from object array (splice)
function del(obj,arr){
	for(var i=0; i<arr.length; i++){
		if(obj == arr[i]){
			arr.splice(i,1);
			return;
		}
	}
}

//keyboard input
document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)
var input = {
	a: false,
	b: false,
	c: false,
	d: false,
	e: false,
	f: false,
	g: false,
	h: false,
	i: false,
	j: false,
	k: false,
	l: false,
	m: false,
	n: false,
	o: false,
	p: false,
	q: false,
	r: false,
	s: false,
	t: false,
	u: false,
	v: false,
	w: false,
	x: false,
	y: false,
	z: false,
}
function keyDown(e){
	if(e.keyCode)
}



//Sprite sheet coordinates according to current frame and width/height
//this.frameX = (this.frameCounter % img.columns) * 100;
//this.frameY = Math.floor(this.frameCounter / img.columns) * 100;